// 뉴스 갱신 — RSS 수집 → Claude 요약 → DB 저장 → 캐시 무효화
import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import { collectNewsFromRSS } from '@/lib/services/rss-collector'
import { summarizeNews } from '@/lib/services/news-summarizer'

const STALE_MINUTES = 30 // 마지막 수집 후 이 시간이 지나야 재수집

export interface NewsInput {
  title: string
  summary_one_line: string
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]
  source_url: string
  published_at: string
}

/**
 * DB에 뉴스를 저장하고 캐시를 무효화합니다.
 */
export async function saveNewsItems(items: NewsInput[]): Promise<{ saved: number }> {
  const supabase = createPublicClient()
  const { count, error } = await supabase
    .from('news_items')
    .upsert(
      items.map((item) => ({ ...item, collected_at: new Date().toISOString() })),
      { onConflict: 'source_url', ignoreDuplicates: true, count: 'exact' }
    )
  if (error) throw new Error(error.message)
  revalidateTag('news', 'max')
  return { saved: count ?? 0 }
}

/**
 * 마지막 수집 시각을 확인하여 아직 신선하면 false 반환합니다.
 */
async function isStale(): Promise<boolean> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('news_items')
    .select('collected_at')
    .order('collected_at', { ascending: false })
    .limit(1)
    .single()

  if (!data?.collected_at) return true // 데이터 없음 → 갱신 필요

  const minutesAgo = (Date.now() - new Date(data.collected_at).getTime()) / 60000
  return minutesAgo >= STALE_MINUTES
}

/**
 * RSS 피드에서 뉴스 수집 → Claude 요약 → DB 저장
 * - 30분 이내에 이미 수집된 경우 건너뜀 (Claude API 비용 절약)
 * - 1회 실행 비용: 약 10~15원 (Claude Haiku, 20건 기준)
 */
export async function collectAndSaveNews(): Promise<{ collected: number; skipped: boolean }> {
  // 신선도 체크 — 불필요한 Claude API 호출 방지
  if (!(await isStale())) {
    return { collected: 0, skipped: true }
  }

  const rawArticles = await collectNewsFromRSS(7) // 피드당 7개, 총 ~21개
  if (rawArticles.length === 0) return { collected: 0, skipped: false }

  let collected = 0
  const toSave: NewsInput[] = []

  for (const article of rawArticles) {
    try {
      const summary = await summarizeNews(article.title, article.description)
      toSave.push({
        title: article.title,
        summary_one_line: summary.summary_one_line,
        impact_direction: summary.impact_direction,
        related_tickers: summary.related_tickers,
        source_url: article.url,
        published_at: article.publishedAt,
      })
    } catch {
      // 요약 실패 시 건너뜀
    }
  }

  if (toSave.length > 0) {
    const { saved } = await saveNewsItems(toSave)
    collected = saved
  }

  return { collected, skipped: false }
}
