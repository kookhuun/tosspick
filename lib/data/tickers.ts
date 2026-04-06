// 종목 데이터 조회 레이어
// unstable_cache → 5분 캐시, tag: 'tickers'

import { unstable_cache } from 'next/cache'
import { createPublicClient, hasSupabase } from '@/lib/supabase/public'
import { MOCK_POPULAR_TICKERS } from './mock'

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
    if (!hasSupabase()) return MOCK_POPULAR_TICKERS
    try {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('tickers')
        .select('id, symbol, name, market, current_price, price_change_rate')
        .order('volume', { ascending: false })
        .limit(10)
      return data?.length ? (data as TickerBasic[]) : MOCK_POPULAR_TICKERS
    } catch { return MOCK_POPULAR_TICKERS }
  },
  ['popular-tickers'],
  { tags: ['tickers'], revalidate: 600 }
)

// 종목 검색 (캐시 없음 — 검색어마다 다름)
export async function searchTickers(q: string, limit = 20): Promise<TickerBasic[]> {
  if (!q) return getPopularTickers()
  if (!hasSupabase()) {
    const lower = q.toLowerCase()
    return MOCK_POPULAR_TICKERS.filter(
      t => t.symbol.toLowerCase().includes(lower) || t.name.toLowerCase().includes(lower)
    ).slice(0, limit)
  }
  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('tickers')
      .select('id, symbol, name, market, current_price, price_change_rate')
      .or(`symbol.ilike.%${q}%,name.ilike.%${q}%`)
      .order('volume', { ascending: false })
      .limit(limit)
    return data?.length ? (data as TickerBasic[]) : []
  } catch { return [] }
}

// mock 종목 상세 (DB 없을 때)
function getMockTickerDetail(symbol: string) {
  const found = MOCK_POPULAR_TICKERS.find(t => t.symbol.toUpperCase() === symbol.toUpperCase())
  if (!found) return null
  const ticker: TickerDetail = {
    id: found.id,
    symbol: found.symbol,
    name: found.name,
    market: found.market,
    current_price: found.current_price,
    price_change: found.current_price * (found.price_change_rate / 100),
    price_change_rate: found.price_change_rate,
    volume: 5000000,
    market_cap: found.current_price * 5000000,
  }
  const detail: TickerDetailData = {
    per: 15.2,
    pbr: 1.4,
    eps: 3200,
    dividend_rate: 1.8,
    chart_data: {},
    ai_earnings_summary: 'DB 연결 후 AI 분석이 제공됩니다.',
    ai_opinion: 'neutral',
    ai_opinion_reason: ['데이터 준비 중입니다.'],
    ai_causal_story: 'DB 연결 후 인과관계 분석이 제공됩니다.',
    next_earnings_date: null,
    ai_analyzed_at: null,
  }
  return { ticker, detail }
}

// 종목 상세 (심볼별 5분 캐시)
export const getTickerDetail = (symbol: string) =>
  unstable_cache(
    async () => {
      if (!hasSupabase()) return getMockTickerDetail(symbol)
      try {
        const supabase = createPublicClient()
        const { data: ticker, error } = await supabase
          .from('tickers')
          .select('id, symbol, name, market, current_price, price_change, price_change_rate, volume, market_cap')
          .eq('symbol', symbol.toUpperCase())
          .single()

        if (error || !ticker) return getMockTickerDetail(symbol)

        const { data: detail } = await supabase
          .from('ticker_details')
          .select('per, pbr, eps, dividend_rate, chart_data, ai_earnings_summary, ai_opinion, ai_opinion_reason, ai_causal_story, next_earnings_date, ai_analyzed_at')
          .eq('ticker_id', ticker.id)
          .single()

        return { ticker: ticker as TickerDetail, detail: (detail ?? null) as TickerDetailData | null }
      } catch { return getMockTickerDetail(symbol) }
    },
    [`ticker-${symbol.toUpperCase()}`],
    { tags: ['tickers', `ticker-${symbol.toUpperCase()}`], revalidate: 300 }
  )()

// 종목 관련 뉴스
export const getTickerNews = (symbol: string) =>
  unstable_cache(
    async () => {
      if (!hasSupabase()) return []
      try {
        const supabase = createPublicClient()
        const { data } = await supabase
          .from('news_items')
          .select('id, title, summary_one_line, impact_direction, published_at, source_url')
          .contains('related_tickers', [symbol.toUpperCase()])
          .order('published_at', { ascending: false })
          .limit(5)
        return data ?? []
      } catch { return [] }
    },
    [`ticker-news-${symbol.toUpperCase()}`],
    { tags: ['news', `ticker-${symbol.toUpperCase()}`], revalidate: 1800 }
  )()
