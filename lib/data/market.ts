// 시장 데이터 조회 레이어
// unstable_cache → 10분 캐시, tag: 'market'

import { unstable_cache } from 'next/cache'
import { createPublicClient, hasSupabase } from '@/lib/supabase/public'
import {
  MOCK_DOMESTIC_INDICES,
  MOCK_OVERSEAS_INDICES,
  MOCK_SECTORS,
  MOCK_FEAR_GREED,
  MOCK_BIG_MOVERS,
  MOCK_OVERSEAS_SECTORS,
} from './mock'

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
    if (!hasSupabase()) return MOCK_DOMESTIC_INDICES
    try {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('market_indices')
        .select('name, current_value, change, change_rate')
        .in('id', ['KOSPI', 'KOSDAQ'])
      return data?.length ? (data as MarketIndex[]) : MOCK_DOMESTIC_INDICES
    } catch { return MOCK_DOMESTIC_INDICES }
  },
  ['domestic-indices'],
  { tags: ['market'], revalidate: 600 }
)

// 해외 지수 (S&P500, NASDAQ)
export const getOverseasIndices = unstable_cache(
  async (): Promise<MarketIndex[]> => {
    if (!hasSupabase()) return MOCK_OVERSEAS_INDICES
    try {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('market_indices')
        .select('name, current_value, change, change_rate')
        .in('id', ['SPX', 'IXIC'])
      return data?.length ? (data as MarketIndex[]) : MOCK_OVERSEAS_INDICES
    } catch { return MOCK_OVERSEAS_INDICES }
  },
  ['overseas-indices'],
  { tags: ['market'], revalidate: 600 }
)

// 섹터 히트맵
export const getSectors = unstable_cache(
  async (): Promise<Sector[]> => {
    if (!hasSupabase()) return MOCK_SECTORS
    try {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('sectors')
        .select('id, name, change_rate, color')
        .limit(12)
      return data?.length ? (data as Sector[]) : MOCK_SECTORS
    } catch { return MOCK_SECTORS }
  },
  ['sectors'],
  { tags: ['market'], revalidate: 600 }
)

// 공포탐욕 지수
export const getFearGreed = unstable_cache(
  async (): Promise<FearGreedData> => {
    if (!hasSupabase()) return MOCK_FEAR_GREED
    try {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('fear_greed_index')
        .select('score, label')
        .eq('id', 1)
        .single()
      return data ? { score: data.score, label: data.label } : MOCK_FEAR_GREED
    } catch { return MOCK_FEAR_GREED }
  },
  ['fear-greed'],
  { tags: ['market'], revalidate: 600 }
)

// 국내 상승/하락 TOP5
export const getDomesticMovers = unstable_cache(
  async (): Promise<{ gainers: Mover[]; losers: Mover[] }> => {
    if (!hasSupabase()) {
      const domestic = MOCK_BIG_MOVERS.filter(m => ['KOSPI', 'KOSDAQ'].includes(m.market))
      return {
        gainers: domestic.filter(m => m.price_change_rate > 0).slice(0, 5) as Mover[],
        losers: domestic.filter(m => m.price_change_rate < 0).slice(0, 5) as Mover[],
      }
    }
    try {
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
    } catch {
      const domestic = MOCK_BIG_MOVERS.filter(m => ['KOSPI', 'KOSDAQ'].includes(m.market))
      return {
        gainers: domestic.filter(m => m.price_change_rate > 0).slice(0, 5) as Mover[],
        losers: domestic.filter(m => m.price_change_rate < 0).slice(0, 5) as Mover[],
      }
    }
  },
  ['domestic-movers'],
  { tags: ['tickers'], revalidate: 600 }
)

// 해외 종목 섹터별 그룹 (finviz 히트맵)
export const getOverseasSectors = unstable_cache(
  async (): Promise<SectorGroup[]> => {
    if (!hasSupabase()) return MOCK_OVERSEAS_SECTORS
    try {
      const supabase = createPublicClient()
      const { data } = await supabase
        .from('tickers')
        .select('symbol, name, price_change_rate, market_cap, sector')
        .in('market', ['NYSE', 'NASDAQ'])
        .not('sector', 'is', null)
        .order('market_cap', { ascending: false })
        .limit(200)

      if (!data?.length) return MOCK_OVERSEAS_SECTORS

      const map = new Map<string, SectorGroup>()
      for (const t of data) {
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
    } catch { return MOCK_OVERSEAS_SECTORS }
  },
  ['overseas-sectors'],
  { tags: ['tickers'], revalidate: 600 }
)

// 홈 화면용 — 변동 가장 큰 종목 TOP20
export interface BigMover {
  id: string
  symbol: string
  name: string
  market: string
  current_price: number
  price_change: number
  price_change_rate: number
}

export const getBiggestMovers = unstable_cache(
  async (limit = 20): Promise<BigMover[]> => {
    if (!hasSupabase()) return MOCK_BIG_MOVERS.slice(0, limit)
    try {
      const supabase = createPublicClient()
      const [gainersRes, losersRes] = await Promise.allSettled([
        supabase
          .from('tickers')
          .select('id, symbol, name, market, current_price, price_change, price_change_rate')
          .order('price_change_rate', { ascending: false })
          .limit(limit / 2),
        supabase
          .from('tickers')
          .select('id, symbol, name, market, current_price, price_change, price_change_rate')
          .order('price_change_rate', { ascending: true })
          .limit(limit / 2),
      ])
      const gainers = gainersRes.status === 'fulfilled' ? (gainersRes.value.data ?? []) : []
      const losers = losersRes.status === 'fulfilled' ? (losersRes.value.data ?? []) : []
      const combined = [...gainers, ...losers]
        .sort((a, b) => Math.abs(b.price_change_rate) - Math.abs(a.price_change_rate)) as BigMover[]
      return combined.length ? combined : MOCK_BIG_MOVERS.slice(0, limit)
    } catch { return MOCK_BIG_MOVERS.slice(0, limit) }
  },
  ['biggest-movers'],
  { tags: ['tickers'], revalidate: 600 }
)
