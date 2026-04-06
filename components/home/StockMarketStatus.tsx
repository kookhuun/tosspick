// 오늘의 주식현황 — 변동 가장 큰 종목 순서
import Link from 'next/link'
import type { BigMover } from '@/lib/data/market'

interface StockMarketStatusProps {
  movers: BigMover[]
}

export default function StockMarketStatus({ movers }: StockMarketStatusProps) {
  if (movers.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-400 text-center">
        주식 데이터가 없습니다.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <ul className="divide-y divide-gray-50">
        {movers.map((ticker, idx) => {
          const isUp = ticker.price_change_rate >= 0
          const sign = isUp ? '+' : ''
          const rateColor = isUp ? 'text-green-600' : 'text-red-500'
          const rateBg = isUp ? 'bg-green-50' : 'bg-red-50'

          return (
            <li key={ticker.id}>
              <Link
                href={`/stock/${ticker.symbol}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                {/* 순위 */}
                <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{idx + 1}</span>

                {/* 종목명 + 코드 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{ticker.name}</p>
                  <p className="text-[10px] text-gray-400">{ticker.symbol} · {ticker.market}</p>
                </div>

                {/* 현재가 */}
                <span className="text-sm font-medium text-gray-700">
                  {ticker.current_price.toLocaleString()}원
                </span>

                {/* 변동률 배지 */}
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${rateBg} ${rateColor} shrink-0`}>
                  {sign}{ticker.price_change_rate.toFixed(2)}%
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
