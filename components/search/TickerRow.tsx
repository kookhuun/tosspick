// @TASK P3-S3-T1
import Link from 'next/link'

export interface TickerItem {
  id: string
  symbol: string
  name: string
  market: string
  current_price: number
  price_change_rate: number
}

interface TickerRowProps {
  ticker: TickerItem
}

export default function TickerRow({ ticker }: TickerRowProps) {
  const isUp = ticker.price_change_rate >= 0
  const rateText = `${isUp ? '+' : ''}${ticker.price_change_rate.toFixed(2)}%`

  return (
    <Link
      href={`/stock/${ticker.symbol}`}
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-900">{ticker.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{ticker.symbol}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
            {ticker.market}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-sm font-medium text-gray-900">
          {ticker.current_price.toLocaleString()}원
        </span>
        <span className={`text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
          {rateText}
        </span>
      </div>
    </Link>
  )
}
