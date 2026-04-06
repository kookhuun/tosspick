// @TASK P2-S2-T1 (updated) - S2 시장 대시보드 (국내/해외 탭)
// 시장 데이터: unstable_cache (10분) → lib/data/market.ts
import MarketTabs from '@/components/market/MarketTabs'
import IndexCard from '@/components/market/IndexCard'
import SectorHeatmap from '@/components/market/SectorHeatmap'
import FearGreedGauge from '@/components/market/FearGreedGauge'
import TopMovers from '@/components/market/TopMovers'
import OverseasHeatmap from '@/components/market/OverseasHeatmap'
import {
  getDomesticIndices,
  getOverseasIndices,
  getSectors,
  getFearGreed,
  getDomesticMovers,
  getOverseasSectors,
} from '@/lib/data/market'

export default async function MarketPage() {
  const [
    domesticIndices,
    overseasIndices,
    sectors,
    fearGreed,
    { gainers, losers },
    overseasSectors,
  ] = await Promise.all([
    getDomesticIndices(),
    getOverseasIndices(),
    getSectors(),
    getFearGreed(),
    getDomesticMovers(),
    getOverseasSectors(),
  ])

  const domesticContent = (
    <div className="flex flex-col gap-4">
      {domesticIndices.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {domesticIndices.map((idx) => <IndexCard key={idx.name} index={idx} />)}
        </div>
      )}
      {sectors.length > 0 && <SectorHeatmap sectors={sectors} />}
      <FearGreedGauge data={fearGreed} />
      <TopMovers gainers={gainers} losers={losers} />
    </div>
  )

  const overseasContent = (
    <div className="flex flex-col gap-4">
      {overseasIndices.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {overseasIndices.map((idx) => <IndexCard key={idx.name} index={idx} />)}
        </div>
      )}
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
