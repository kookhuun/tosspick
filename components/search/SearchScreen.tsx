// @TASK P3-S3-T1 - 검색 화면 클라이언트 컴포넌트
// NOTE: debounce 300ms, localStorage 최근 검색 5개
'use client'

import { useState, useEffect, useCallback } from 'react'
import TickerRow, { type TickerItem } from './TickerRow'

const RECENT_KEY = 'tosspick_recent_search'
const MAX_RECENT = 5

interface SearchScreenProps {
  popularTickers: TickerItem[]
}

export default function SearchScreen({ popularTickers }: SearchScreenProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) setRecent(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  const search = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/tickers/search?q=${encodeURIComponent(q)}`)
      const json = await res.json()
      setResults(json.tickers ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!query) { setResults([]); return }
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  function handleClickTicker(symbol: string) {
    const updated = [symbol, ...recent.filter((s) => s !== symbol)].slice(0, MAX_RECENT)
    setRecent(updated)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  }

  function clearRecent() {
    setRecent([])
    localStorage.removeItem(RECENT_KEY)
  }

  const isSearching = query.length > 0
  const displayList = isSearching ? results : popularTickers

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      {/* 검색 입력창 */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="종목명 또는 코드 검색"
            className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 최근 검색 (검색창 비었을 때만) */}
      {!isSearching && recent.length > 0 && (
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">최근 검색</span>
            <button onClick={clearRecent} className="text-xs text-gray-400 hover:text-gray-600">
              전체 삭제
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((symbol) => (
              <button
                key={symbol}
                onClick={() => setQuery(symbol)}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 종목 목록 */}
      <div className="flex flex-col bg-white mt-2 rounded-xl mx-2 overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-50">
          <span className="text-xs font-semibold text-gray-500">
            {isSearching ? (loading ? '검색 중...' : `검색 결과 ${results.length}개`) : '인기 종목 TOP 10'}
          </span>
        </div>
        {displayList.length === 0 && !loading ? (
          <p className="px-4 py-6 text-sm text-gray-400 text-center">
            {isSearching ? '검색 결과가 없습니다.' : '종목 데이터가 없습니다.'}
          </p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {displayList.map((ticker) => (
              <li key={ticker.id} onClick={() => handleClickTicker(ticker.symbol)}>
                <TickerRow ticker={ticker} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
