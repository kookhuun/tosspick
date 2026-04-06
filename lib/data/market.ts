// 시장 데이터 조회 레이어
// unstable_cache → 10분 캐시, tag: 'market'

import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

export interface MarketIndex {
  name: string
  current_value: number
  change: number
  change_rate: number
}

export interface Sector {
  id: string
  name: string
  change_rate: number
  color: string
}

export interface FearGreedData {
  score: number
  label: string
}

export interface GlobalIndicator {
  id: string
  type: string
  name: string
  value: number
  change: number
  change_rate: number
  ai_impact_summary: string | null
}

export interface Mover {
  id: string
  symbol: string
  name: string
  price_change_rate: number
}

export interface SectorGroup {
  name: string
  tickers: { symbol: string; name: string; change_rate: number; market_cap: number }[]
}

// 국내 지수 (KOSPI, KOSDAQ)
export const getDomesticIndices = unstable_cache(
  async (): Promise<MarketIndex[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('market_indices')
      .select('name, current_value, change, change_rate')
      .in('id', ['KOSPI', 'KOSDAQ'])
    return (data ?? []) as MarketIndex[]
  },
  ['domestic-indices'],
  { tags: ['market'], revalidate: 600 } // 10분
)

// 해외 지수 (S&P500, NASDAQ)
export const getOverseasIndices = unstable_cache(
  async (): Promise<MarketIndex[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('market_indices')
      .select('name, current_value, change, change_rate')
      .in('id', ['SPX', 'IXIC'])
    return (data ?? []) as MarketIndex[]
  },
  ['overseas-indices'],
  { tags: ['market'], revalidate: 600 }
)

// 섹터 히트맵
export const getSectors = unstable_cache(
  async (): Promise<Sector[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('sectors')
      .select('id, name, change_rate, color')
      .limit(12)
    return (data ?? []) as Sector[]
  },
  ['sectors'],
  { tags: ['market'], revalidate: 600 }
)

// 공포탐욕 지수
export const getFearGreed = unstable_cache(
  async (): Promise<FearGreedData> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('fear_greed_index')
      .select('score, label')
      .eq('id', 1)
      .single()
    return data ? { score: data.score, label: data.label } : { score: 50, label: 'neutral' }
  },
  ['fear-greed'],
  { tags: ['market'], revalidate: 600 }
)

// 국내 상승/하락 TOP5
export const getDomesticMovers = unstable_cache(
  async (): Promise<{ gainers: Mover[]; losers: Mover[] }> => {
    const supabase = createPublicClient()
    const [gainersRes, losersRes] = await Promise.allSettled([
      supabase
        .from('tickers')
        .select('id, symbol, name, price_change_rate')
        .in('market', ['KOSPI', 'KOSDAQ'])
        .order('price_change_rate', { ascending: false })
        .limit(5),
      supabase
        .from('tickers')
        .select('id, symbol, name, price_change_rate')
        .in('market', ['KOSPI', 'KOSDAQ'])
        .order('price_change_rate', { ascending: true })
        .limit(5),
    ])
    return {
      gainers: gainersRes.status === 'fulfilled' ? ((gainersRes.value.data ?? []) as Mover[]) : [],
      losers: losersRes.status === 'fulfilled' ? ((losersRes.value.data ?? []) as Mover[]) : [],
    }
  },
  ['domestic-movers'],
  { tags: ['tickers'], revalidate: 600 }
)

// 해외 종목 섹터별 그룹 (finviz 히트맵)
export const getOverseasSectors = unstable_cache(
  async (): Promise<SectorGroup[]> => {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from('tickers')
      .select('symbol, name, price_change_rate, market_cap, sector')
      .in('market', ['NYSE', 'NASDAQ'])
      .not('sector', 'is', null)
      .order('market_cap', { ascending: false })
      .limit(200)

    const map = new Map<string, SectorGroup>()
    for (const t of data ?? []) {
      const s = t.sector as string
      if (!map.has(s)) map.set(s, { name: s, tickers: [] })
      map.get(s)!.tickers.push({
        symbol: t.symbol,
        name: t.name,
        change_rate: t.price_change_rate ?? 0,
        market_cap: t.market_cap ?? 0,
      })
    }
    return Array.from(map.values())
  },
  ['overseas-sectors'],
  { tags: ['tickers'], revalidate: 600 }
)
