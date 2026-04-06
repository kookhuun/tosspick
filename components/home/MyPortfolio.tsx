// 내가 투자한 종목 — 로그인 여부에 따라 분기
import Link from 'next/link'

interface WatchlistTicker {
  symbol: string
  name: string
  current_price: number
  price_change_rate: number
}

interface MyPortfolioProps {
  isLoggedIn: boolean
  tickers?: WatchlistTicker[]
}

export default function MyPortfolio({ isLoggedIn, tickers = [] }: MyPortfolioProps) {
  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center gap-3">
        <span className="text-2xl">🔒</span>
        <p className="text-sm font-semibold text-gray-700 text-center">
          로그인하면 내 종목을 확인할 수 있어요
        </p>
        <p className="text-xs text-gray-400 text-center">
          관심 종목을 등록하고 한눈에 모아보세요
        </p>
        <Link
          href="/auth/login"
          className="mt-1 px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          로그인하기
        </Link>
      </div>
    )
  }

  if (tickers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center gap-2">
        <span className="text-2xl">📌</span>
        <p className="text-sm font-semibold text-gray-700">관심 종목이 없습니다</p>
        <Link href="/search" className="text-xs text-blue-600 hover:underline">
          종목 검색해서 추가하기 →
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <ul className="divide-y divide-gray-50">
        {tickers.map((ticker) => {
          const isUp = ticker.price_change_rate >= 0
          return (
            <li key={ticker.symbol}>
              <Link
                href={`/stock/${ticker.symbol}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-gray-900">{ticker.name}</span>
                  <span className="text-xs text-gray-400">{ticker.symbol}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-medium text-gray-800">
                    {ticker.current_price.toLocaleString()}원
                  </span>
                  <span className={`text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                    {isUp ? '+' : ''}{ticker.price_change_rate.toFixed(2)}%
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
