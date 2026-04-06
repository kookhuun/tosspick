'use client'

// @TASK P4-S6 - 실적 캘린더 탭

import { useState, useEffect } from 'react'

interface WatchlistItem {
  id: string
  ticker_id: string
  ticker: { symbol: string; name: string } | null
}

interface EarningsEvent {
  id: string
  ticker_id: string
  scheduled_date: string
  is_confirmed: boolean
  result_eps: number | null
  result_revenue: number | null
  ticker: { symbol: string; name: string } | null
}

export default function EarningsCalendarTab() {
  const [events, setEvents] = useState<EarningsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setLoading(true)
    setError(null)
    try {
      // 관심주 목록 먼저 조회
      const watchlistRes = await fetch('/api/watchlist')
      if (!watchlistRes.ok) throw new Error('관심주 조회 실패')
      const watchlist: WatchlistItem[] = await watchlistRes.json()

      if (watchlist.length === 0) {
        setEvents([])
        setLoading(false)
        return
      }

      const tickerIds = watchlist.map((w) => w.ticker_id).join(',')
      const eventsRes = await fetch(
        `/api/earnings-events?ticker_ids=${tickerIds}&future_only=true`
      )
      if (!eventsRes.ok) throw new Error('실적 일정 조회 실패')
      const data: EarningsEvent[] = await eventsRes.json()
      setEvents(data)
    } catch {
      setError('실적 일정을 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-16" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500 mb-3">{error}</p>
        <button onClick={fetchEvents} className="text-sm text-[#3182F6] font-medium">
          다시 시도
        </button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-sm text-gray-400">예정된 실적 발표가 없습니다.</p>
        <p className="text-xs text-gray-300 mt-1">관심주를 추가하면 실적 일정이 표시됩니다.</p>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 mb-2">관심주 실적 발표 예정일</p>
      {events.map((event, idx) => {
        const dateObj = new Date(event.scheduled_date)
        const isFirst = idx === 0
        const dateStr = dateObj.toLocaleDateString('ko-KR', {
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        })
        const daysUntil = Math.ceil(
          (dateObj.getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)
        )

        return (
          <div
            key={event.id}
            className={`bg-white rounded-2xl p-4 flex items-center gap-3 ${
              isFirst ? 'ring-2 ring-[#3182F6] ring-opacity-30' : ''
            }`}
          >
            {/* 날짜 블록 */}
            <div
              className={`flex-shrink-0 w-12 text-center rounded-xl py-2 ${
                isFirst ? 'bg-[#3182F6]' : 'bg-gray-50'
              }`}
            >
              <p
                className={`text-xs font-medium ${
                  isFirst ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                {dateObj.toLocaleDateString('ko-KR', { month: 'numeric' })}월
              </p>
              <p
                className={`text-lg font-bold leading-none ${
                  isFirst ? 'text-white' : 'text-gray-900'
                }`}
              >
                {dateObj.getDate()}
              </p>
            </div>

            {/* 종목 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {event.ticker?.name ?? event.ticker_id}
                </span>
                {event.ticker?.symbol && (
                  <span className="text-xs text-gray-400">{event.ticker.symbol}</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{dateStr}</p>
            </div>

            {/* 오른쪽 배지 */}
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  event.is_confirmed
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-yellow-50 text-yellow-600'
                }`}
              >
                {event.is_confirmed ? '확정' : '미확정'}
              </span>
              {isFirst && (
                <span className="text-xs text-[#3182F6] font-medium">
                  D-{daysUntil}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
