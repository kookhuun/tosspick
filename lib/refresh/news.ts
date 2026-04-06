// ================================================================
// 뉴스 갱신 함수 — 나중에 cron이 호출할 함수
// ================================================================
//
// [지금] 구조만 준비. 실제 외부 API 호출 로직은 TODO.
//
// [나중에 cron 붙이는 방법]
// 1. 이 함수에 실제 NewsAPI 호출 로직 구현
// 2. app/api/cron/collect-news/route.ts 에서 이 함수 호출
// 3. vercel.json 에 cron 설정 추가 (아래 주석 참고)
// 4. POST /api/revalidate?tag=news 로 캐시 무효화
//
// ================================================================

import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

export interface NewsInput {
  title: string
  summary_one_line: string
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]
  source_url: string
  published_at: string
}

/**
 * 뉴스 데이터를 DB에 저장하고 캐시를 무효화한다.
 * 외부에서 뉴스 데이터를 수집한 후 이 함수를 호출하면 된다.
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

  // 저장 후 캐시 무효화 → 다음 사용자 접속 시 fresh data 제공
  revalidateTag('news', 'max')

  return { saved: count ?? 0 }
}

/**
 * TODO: 외부 뉴스 API에서 뉴스 수집 → AI 요약 → saveNewsItems 호출
 *
 * 구현 시 필요한 것:
 * - NEWS_API_KEY 환경변수
 * - ANTHROPIC_API_KEY 환경변수
 * - lib/services/news-collector.ts (기존 파일 활용)
 * - lib/services/news-summarizer.ts (기존 파일 활용)
 */
export async function collectAndSaveNews(): Promise<{ collected: number }> {
  // TODO: 구현 예정
  // const articles = await collectNews(20)
  // const summarized = await Promise.all(articles.map(summarizeNews))
  // const { saved } = await saveNewsItems(summarized)
  // return { collected: saved }

  console.warn('[refresh/news] collectAndSaveNews: 아직 구현되지 않았습니다.')
  return { collected: 0 }
}
