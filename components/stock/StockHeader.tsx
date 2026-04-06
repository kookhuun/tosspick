// @TASK P3-S4-T1
'use client'

import { useState } from 'react'

export interface TickerData {
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

interface StockHeaderProps {
  ticker: TickerData
  isLoggedIn: boolean
}

export default function StockHeader({ ticker, isLoggedIn }: StockHeaderProps) {
  const [watchlisted, setWatchlisted] = useState(false)
  const isUp = ticker.price_change_rate >= 0

  async function handleWatchlist() {
    if (!isLoggedIn) {
      window.location.href = '/auth/login'
      return
    }
    setWatchlisted((prev) => !prev)
    // TODO P4: watchlist API 연동
  }

  return (
    <div className="bg-white px-4 pt-5 pb-4 border-b border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{ticker.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{ticker.symbol}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
              {ticker.market}
            </span>
          </div>
        </div>
        <button
          onClick={handleWatchlist}
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
            watchlisted
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
          }`}
        >
          {watchlisted ? '관심주 ✓' : '+ 관심주'}
        </button>
      </div>

      <div className="mt-3">
        <span className="text-2xl font-bold text-gray-900">
          {ticker.current_price.toLocaleString()}원
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-sm font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
            {isUp ? '+' : ''}{ticker.price_change.toLocaleString()}원
          </span>
          <span className={`text-sm font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
            ({isUp ? '+' : ''}{ticker.price_change_rate.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  )
}
