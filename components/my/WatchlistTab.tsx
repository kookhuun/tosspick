'use client'

// @TASK P4-S6 - 관심주 탭

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface WatchlistItem {
  id: string
  ticker_id: string
  added_at: string
  alert_enabled: boolean
  ticker: {
    symbol: string
    name: string
    current_price: number
    price_change: number
    price_change_rate: number
  } | null
}

export default function WatchlistTab() {
  const router = useRouter()
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  async function fetchWatchlist() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/watchlist')
      if (!res.ok) throw new Error('불러오기 실패')
      const data = await res.json()
      setItems(data)
    } catch {
      setError('관심주 목록을 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/watchlist/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('삭제 실패')
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch {
      alert('삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500 mb-3">{error}</p>
        <button
          onClick={fetchWatchlist}
          className="text-sm text-[#3182F6] font-medium"
        >
          다시 시도
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-sm text-gray-400">아직 관심주가 없습니다.</p>
        <p className="text-xs text-gray-300 mt-1">종목 페이지에서 관심주를 추가해보세요.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const ticker = item.ticker
        if (!ticker) return null
        const isPositive = ticker.price_change_rate >= 0
        const isDeleting = deletingId === item.id

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
            onClick={() => router.push(`/stock/${ticker.symbol}`)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">{ticker.symbol}</span>
                <span className="text-xs text-gray-400 truncate">{ticker.name}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-base font-semibold text-gray-900">
                  {ticker.current_price.toLocaleString()}원
                </span>
                <span
                  className={`text-xs font-medium ${
                    isPositive ? 'text-[#F04452]' : 'text-[#3182F6]'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {ticker.price_change_rate.toFixed(2)}%
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(item.id)
              }}
              disabled={isDeleting}
              className="ml-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="관심주 삭제"
            >
              {isDeleting ? (
                <span className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
