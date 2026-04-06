// 뉴스 데이터 조회 레이어
// unstable_cache → 30분 캐시, tag: 'news'
// 사용자가 접속할 때마다 캐시가 살아있으면 DB 조회 없이 즉시 응답
// 30분 경과 후 첫 접속자가 오면 백그라운드에서 자동 재생성 (stale-while-revalidate)

import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

export interface NewsItem {
  id: string
  title: string
  summary_one_line: string | null
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]
  source_url: string
  published_at: string
}

export const getNewsItems = unstable_cache(
  async (limit = 10): Promise<NewsItem[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('news_items')
      .select('id, title, summary_one_line, impact_direction, related_tickers, source_url, published_at')
      .order('published_at', { ascending: false })
      .limit(limit)
    return (data ?? []) as NewsItem[]
  },
  ['news-items'],
  {
    tags: ['news'],
    revalidate: 1800, // 30분 — 나중에 cron이 revalidateTag('news') 호출하면 즉시 갱신됨
  }
)
