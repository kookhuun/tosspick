// 종목 데이터 조회 레이어
// unstable_cache → 5분 캐시, tag: 'tickers'

import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

export interface TickerBasic {
  id: string
  symbol: string
  name: string
  market: string
  current_price: number
  price_change_rate: number
}

export interface TickerDetail {
  id: string
  symbol: string
  name: string
  market: string
  current_price: number
  price_change: number
  price_change_rate: number
  volume: number
  market_cap: number
}

export interface TickerDetailData {
  per: number | null
  pbr: number | null
  eps: number | null
  dividend_rate: number | null
  chart_data: Record<string, unknown>
  ai_earnings_summary: string | null
  ai_opinion: string | null
  ai_opinion_reason: string[] | null
  ai_causal_story: string | null
  next_earnings_date: string | null
  ai_analyzed_at: string | null
}

// 인기 종목 TOP10
export const getPopularTickers = unstable_cache(
  async (): Promise<TickerBasic[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('tickers')
      .select('id, symbol, name, market, current_price, price_change_rate')
      .order('volume', { ascending: false })
      .limit(10)
    return (data ?? []) as TickerBasic[]
  },
  ['popular-tickers'],
  { tags: ['tickers'], revalidate: 600 } // 10분
)

// 종목 검색 (캐시 없음 — 검색어마다 다름)
export async function searchTickers(q: string, limit = 20): Promise<TickerBasic[]> {
  const supabase = createPublicClient()
  if (!q) return getPopularTickers()

  const { data } = await supabase
    .from('tickers')
    .select('id, symbol, name, market, current_price, price_change_rate')
    .or(`symbol.ilike.%${q}%,name.ilike.%${q}%`)
    .order('volume', { ascending: false })
    .limit(limit)
  return (data ?? []) as TickerBasic[]
}

// 종목 상세 (심볼별 5분 캐시)
export const getTickerDetail = (symbol: string) =>
  unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data: ticker, error } = await supabase
        .from('tickers')
        .select('id, symbol, name, market, current_price, price_change, price_change_rate, volume, market_cap')
        .eq('symbol', symbol.toUpperCase())
        .single()

      if (error || !ticker) return null

      const { data: detail } = await supabase
        .from('ticker_details')
        .select('per, pbr, eps, dividend_rate, chart_data, ai_earnings_summary, ai_opinion, ai_opinion_reason, ai_causal_story, next_earnings_date, ai_analyzed_at')
        .eq('ticker_id', ticker.id)
        .single()

      return { ticker: ticker as TickerDetail, detail: (detail ?? null) as TickerDetailData | null }
    },
    [`ticker-${symbol.toUpperCase()}`],
    { tags: ['tickers', `ticker-${symbol.toUpperCase()}`], revalidate: 300 } // 5분
  )()

// 종목 관련 뉴스
export const getTickerNews = (symbol: string) =>
  unstable_cache(
    async () => {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('news_items')
        .select('id, title, summary_one_line, impact_direction, published_at, source_url')
        .contains('related_tickers', [symbol.toUpperCase()])
        .order('published_at', { ascending: false })
        .limit(5)
      return data ?? []
    },
    [`ticker-news-${symbol.toUpperCase()}`],
    { tags: ['news', `ticker-${symbol.toUpperCase()}`], revalidate: 1800 }
  )()
