// @TASK P2-S2-T1 - S2 시장 대시보드 화면
import { createClient } from '@/lib/supabase/server'
import IndexCard, { type MarketIndex } from '@/components/market/IndexCard'
import SectorHeatmap, { type Sector } from '@/components/market/SectorHeatmap'
import FearGreedGauge, { type FearGreedData } from '@/components/market/FearGreedGauge'
import TopMovers, { type Mover } from '@/components/market/TopMovers'

async function getMarketData() {
  const supabase = await createClient()

  const [indicesRes, sectorsRes, fearGreedRes, gainersRes, losersRes] = await Promise.allSettled([
    supabase.from('market_indices').select('name, current_value, change, change_rate').limit(4),
    supabase.from('sectors').select('id, name, change_rate, color').limit(12),
    supabase.from('fear_greed_indices').select('score, label').order('updated_at', { ascending: false }).limit(1),
    supabase.from('tickers').select('id, symbol, name, price_change_rate').order('price_change_rate', { ascending: false }).limit(5),
    supabase.from('tickers').select('id, symbol, name, price_change_rate').order('price_change_rate', { ascending: true }).limit(5),
  ])

  const indices: MarketIndex[] = indicesRes.status === 'fulfilled' ? (indicesRes.value.data ?? []) : []
  const sectors: Sector[] = sectorsRes.status === 'fulfilled' ? (sectorsRes.value.data ?? []) : []
  const fearGreed: FearGreedData = fearGreedRes.status === 'fulfilled' && fearGreedRes.value.data?.[0]
    ? { score: fearGreedRes.value.data[0].score, label: fearGreedRes.value.data[0].label }
    : { score: 50, label: 'neutral' }
  const gainers: Mover[] = gainersRes.status === 'fulfilled' ? (gainersRes.value.data ?? []) : []
  const losers: Mover[] = losersRes.status === 'fulfilled' ? (losersRes.value.data ?? []) : []

  return { indices, sectors, fearGreed, gainers, losers }
}

export const revalidate = 300 // 5분 캐시

export default async function MarketPage() {
  const { indices, sectors, fearGreed, gainers, losers } = await getMarketData()

  return (
    <main className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h2 className="text-base font-bold text-gray-900">시장 대시보드</h2>

      {/* 4개 지수 카드 */}
      <div className="grid grid-cols-2 gap-3">
        {indices.map((index) => (
          <IndexCard key={index.name} index={index} />
        ))}
      </div>

      {/* 섹터 히트맵 */}
      {sectors.length > 0 && <SectorHeatmap sectors={sectors} />}

      {/* 공포탐욕 지수 */}
      <FearGreedGauge data={fearGreed} />

      {/* 상승/하락 TOP5 */}
      <TopMovers gainers={gainers} losers={losers} />
    </main>
  )
}
