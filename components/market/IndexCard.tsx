// @TASK P2-S2-T1
export interface MarketIndex {
  name: string
  current_value: number
  change: number
  change_rate: number
}

export default function IndexCard({ index }: { index: MarketIndex }) {
  const isUp = index.change >= 0
  const sign = isUp ? '+' : ''
  const colorClass = isUp ? 'text-green-600' : 'text-red-500'

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{index.name}</p>
      <p className="text-lg font-bold text-gray-900">{index.current_value.toLocaleString()}</p>
      <p className={`text-xs font-medium ${colorClass}`}>
        {sign}{index.change.toFixed(2)} ({sign}{index.change_rate.toFixed(2)}%)
      </p>
    </div>
  )
}
