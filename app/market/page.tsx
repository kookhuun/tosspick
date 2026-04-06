// @TASK P2-S2-T1 (updated) - S2 시장 대시보드 (국내/해외 탭)
import { createClient } from '@/lib/supabase/server'
import MarketTabs from '@/components/market/MarketTabs'
import IndexCard, { type MarketIndex } from '@/components/market/IndexCard'
import SectorHeatmap, { type Sector } from '@/components/market/SectorHeatmap'
import FearGreedGauge, { type FearGreedData } from '@/components/market/FearGreedGauge'
import TopMovers, { type Mover } from '@/components/market/TopMovers'
import OverseasHeatmap, { type SectorGroup } from '@/components/market/OverseasHeatmap'

async function getMarketData() {
  const supabase = await createClient()

  const [
    domesticIndicesRes,
    overseasIndicesRes,
    sectorsRes,
    fearGreedRes,
    gainersRes,
    losersRes,
    overseasTickersRes,
  ] = await Promise.allSettled([
    // 국내 지수: KOSPI, KOSDAQ
    supabase
      .from('market_indices')
      .select('name, current_value, change, change_rate')
      .in('id', ['KOSPI', 'KOSDAQ']),

    // 해외 지수: S&P500, NASDAQ
    supabase
      .from('market_indices')
      .select('name, current_value, change, change_rate')
      .in('id', ['SPX', 'IXIC']),

    // 국내 섹터
    supabase.from('sectors').select('id, name, change_rate, color').limit(12),

    // 공포탐욕
    supabase
      .from('fear_greed_index')
      .select('score, label')
      .eq('id', 1)
      .single(),

    // 국내 상승 TOP5
    supabase
      .from('tickers')
      .select('id, symbol, name, price_change_rate')
      .in('market', ['KOSPI', 'KOSDAQ'])
      .order('price_change_rate', { ascending: false })
      .limit(5),

    // 국내 하락 TOP5
    supabase
      .from('tickers')
      .select('id, symbol, name, price_change_rate')
      .in('market', ['KOSPI', 'KOSDAQ'])
      .order('price_change_rate', { ascending: true })
      .limit(5),

    // 해외 종목 (섹터별 히트맵용)
    supabase
      .from('tickers')
      .select('symbol, name, change_rate:price_change_rate, market_cap, sector')
      .in('market', ['NYSE', 'NASDAQ'])
      .not('sector', 'is', null)
      .order('market_cap', { ascending: false })
      .limit(200),
  ])

  const domesticIndices: MarketIndex[] =
    domesticIndicesRes.status === 'fulfilled' ? (domesticIndicesRes.value.data ?? []) : []
  const overseasIndices: MarketIndex[] =
    overseasIndicesRes.status === 'fulfilled' ? (overseasIndicesRes.value.data ?? []) : []
  const sectors: Sector[] =
    sectorsRes.status === 'fulfilled' ? (sectorsRes.value.data ?? []) : []
  const fearGreed: FearGreedData =
    fearGreedRes.status === 'fulfilled' && fearGreedRes.value.data
      ? { score: fearGreedRes.value.data.score, label: fearGreedRes.value.data.label }
      : { score: 50, label: 'neutral' }
  const gainers: Mover[] =
    gainersRes.status === 'fulfilled' ? (gainersRes.value.data ?? []) : []
  const losers: Mover[] =
    losersRes.status === 'fulfilled' ? (losersRes.value.data ?? []) : []

  // 해외 종목을 섹터별로 그룹핑
  const overseasRaw =
    overseasTickersRes.status === 'fulfilled' ? (overseasTickersRes.value.data ?? []) : []

  const sectorMap = new Map<string, SectorGroup>()
  for (const t of overseasRaw) {
    const sectorName = t.sector as string
    if (!sectorMap.has(sectorName)) {
      sectorMap.set(sectorName, { name: sectorName, tickers: [] })
    }
    sectorMap.get(sectorName)!.tickers.push({
      symbol: t.symbol,
      name: t.name,
      change_rate: t.change_rate ?? 0,
      market_cap: t.market_cap ?? 0,
    })
  }
  const overseasSectors: SectorGroup[] = Array.from(sectorMap.values())

  return {
    domesticIndices,
    overseasIndices,
    sectors,
    fearGreed,
    gainers,
    losers,
    overseasSectors,
  }
}

export const revalidate = 300 // 5분 캐시

export default async function MarketPage() {
  const { domesticIndices, overseasIndices, sectors, fearGreed, gainers, losers, overseasSectors } =
    await getMarketData()

  const domesticContent = (
    <div className="flex flex-col gap-4">
      {/* KOSPI / KOSDAQ 지수 */}
      {domesticIndices.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {domesticIndices.map((idx) => (
            <IndexCard key={idx.name} index={idx} />
          ))}
        </div>
      )}

      {/* 섹터 히트맵 */}
      {sectors.length > 0 && <SectorHeatmap sectors={sectors} />}

      {/* 공포탐욕 지수 */}
      <FearGreedGauge data={fearGreed} />

      {/* 상승/하락 TOP5 */}
      <TopMovers gainers={gainers} losers={losers} />
    </div>
  )

  const overseasContent = (
    <div className="flex flex-col gap-4">
      {/* S&P500 / NASDAQ 지수 */}
      {overseasIndices.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {overseasIndices.map((idx) => (
            <IndexCard key={idx.name} index={idx} />
          ))}
        </div>
      )}

      {/* 섹터별 종목 히트맵 (finviz 스타일) */}
      <OverseasHeatmap sectors={overseasSectors} />
    </div>
  )

  return (
    <main className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h2 className="text-base font-bold text-gray-900">시장 대시보드</h2>
      <MarketTabs domestic={domesticContent} overseas={overseasContent} />
    </main>
  )
}
