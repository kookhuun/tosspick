// 뉴스 갱신 — RSS/Google News 수집 → Gemini 요약 → DB 저장 → 캐시 무효화
import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import { collectNewsFromRSS } from '@/lib/services/rss-collector'
import { summarizeNews } from '@/lib/services/news-summarizer'

const STALE_MINUTES = 30

interface NewsInput {
  title: string
  ai_headline: string
  summary_one_line: string
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]
  source_url: string
  published_at: string
  image_url: string | null
}

async function isStale(): Promise<boolean> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('news_items')
    .select('collected_at')
    .order('collected_at', { ascending: false })
    .limit(1)
    .single()

  if (!data?.collected_at) return true
  const minutesAgo = (Date.now() - new Date(data.collected_at).getTime()) / 60000
  return minutesAgo >= STALE_MINUTES
}

/**
 * RSS/Google News 수집 → Gemini 요약+헤드라인 → DB 저장
 * 30분 이내 수집된 경우 건너뜀 (API 비용 절약)
 */
export async function collectAndSaveNews(): Promise<{ collected: number; skipped: boolean }> {
  if (!(await isStale())) return { collected: 0, skipped: true }

  const rawArticles = await collectNewsFromRSS(6) // 피드당 6개
  if (rawArticles.length === 0) return { collected: 0, skipped: false }

  const toSave: NewsInput[] = []

  for (const article of rawArticles) {
    try {
      const summary = await summarizeNews(article.title, article.description)
      toSave.push({
        title: article.title,
        ai_headline: summary.ai_headline,
        summary_one_line: summary.summary_one_line,
        impact_direction: summary.impact_direction,
        related_tickers: summary.related_tickers,
        source_url: article.url,
        published_at: article.publishedAt,
        image_url: article.imageUrl,
      })
    } catch {
      // 요약 실패 시 건너뜀
    }
  }

  if (toSave.length === 0) return { collected: 0, skipped: false }

  const supabase = createPublicClient()
  const { count } = await supabase
    .from('news_items')
    .upsert(
      toSave.map((item) => ({ ...item, collected_at: new Date().toISOString() })),
      { onConflict: 'source_url', ignoreDuplicates: true, count: 'exact' }
    )

  revalidateTag('news', 'max')
  return { collected: count ?? 0, skipped: false }
}
