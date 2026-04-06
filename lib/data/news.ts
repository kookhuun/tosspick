// 뉴스 데이터 조회 레이어 — unstable_cache 30분, tag: 'news'
import { unstable_cache } from 'next/cache'
import { createPublicClient, hasSupabase } from '@/lib/supabase/public'
import { MOCK_NEWS } from './mock'

export interface NewsItem {
  id: string
  title: string
  ai_headline: string | null
  summary_one_line: string | null
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]
  source_url: string
  published_at: string
  image_url: string | null
}

export const getNewsItems = unstable_cache(
  async (limit = 10): Promise<NewsItem[]> => {
    if (!hasSupabase()) return MOCK_NEWS.slice(0, limit)
    try {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('news_items')
        .select('id, title, ai_headline, summary_one_line, impact_direction, related_tickers, source_url, published_at, image_url')
        .order('published_at', { ascending: false })
        .limit(limit)
      return data?.length ? (data as NewsItem[]) : MOCK_NEWS.slice(0, limit)
    } catch {
      return MOCK_NEWS.slice(0, limit)
    }
  },
  ['news-items'],
  { tags: ['news'], revalidate: 1800 }
)
