'use client'

// @TASK P4-S6 - 매매기록 탭

import { useState, useEffect } from 'react'

interface TradeRecord {
  id: string
  ticker_id: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  recorded_at: string
  memo: string | null
  ticker: {
    symbol: string
    name: string
    current_price: number
  } | null
}

interface TradeStats {
  total_profit_loss: number
  total_profit_rate: number
  total_buy: number
  total_sell: number
}

interface AddFormData {
  ticker_id: string
  type: 'buy' | 'sell'
  quantity: string
  price: string
  recorded_at: string
  memo: string
}

const INIT_FORM: AddFormData = {
  ticker_id: '',
  type: 'buy',
  quantity: '',
  price: '',
  recorded_at: new Date().toISOString().split('T')[0],
  memo: '',
}

export default function TradeRecordTab() {
  const [records, setRecords] = useState<TradeRecord[]>([])
  const [stats, setStats] = useState<TradeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AddFormData>(INIT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    setError(null)
    try {
      const [recordsRes, statsRes] = await Promise.all([
        fetch('/api/trade-records'),
        fetch('/api/trade-records/stats'),
      ])
      if (!recordsRes.ok || !statsRes.ok) throw new Error('불러오기 실패')
      const [recordsData, statsData] = await Promise.all([
        recordsRes.json(),
        statsRes.json(),
      ])
      setRecords(recordsData)
      setStats(statsData)
    } catch {
      setError('매매기록을 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/trade-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker_id: form.ticker_id.trim(),
          type: form.type,
          quantity: Number(form.quantity),
          price: Number(form.price),
          recorded_at: form.recorded_at,
          memo: form.memo.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? '추가 실패')
      }
      setForm(INIT_FORM)
      setShowForm(false)
      await fetchAll()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : '추가에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/trade-records/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('삭제 실패')
      setRecords((prev) => prev.filter((r) => r.id !== id))
      // 통계 새로고침
      const statsRes = await fetch('/api/trade-records/stats')
      if (statsRes.ok) setStats(await statsRes.json())
    } catch {
      alert('삭제에 실패했습니다.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl p-5 animate-pulse h-24" />
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
        <button onClick={fetchAll} className="text-sm text-[#3182F6] font-medium">
          다시 시도
        </button>
      </div>
    )
  }

  const isProfitable = (stats?.total_profit_loss ?? 0) >= 0

  return (
    <div className="space-y-3">
      {/* 손익 통계 카드 */}
      {stats && (
        <div className="bg-white rounded-2xl p-5">
          <p className="text-xs text-gray-400 mb-1">총 손익</p>
          <p
            className={`text-3xl font-bold ${
              isProfitable ? 'text-[#F04452]' : 'text-[#3182F6]'
            }`}
          >
            {isProfitable ? '+' : ''}
            {stats.total_profit_loss.toLocaleString()}원
          </p>
          <p
            className={`text-sm font-medium mt-0.5 ${
              isProfitable ? 'text-[#F04452]' : 'text-[#3182F6]'
            }`}
          >
            {isProfitable ? '+' : ''}
            {stats.total_profit_rate.toFixed(2)}%
          </p>
          <div className="mt-3 flex gap-4 text-xs text-gray-400">
            <span>매수 {stats.total_buy.toLocaleString()}원</span>
            <span>매도 {stats.total_sell.toLocaleString()}원</span>
          </div>
        </div>
      )}

      {/* 추가 버튼 */}
      <button
        onClick={() => setShowForm((v) => !v)}
        className="w-full bg-[#3182F6] text-white rounded-2xl py-3 text-sm font-semibold"
      >
        {showForm ? '취소' : '+ 기록 추가'}
      </button>

      {/* 추가 폼 */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-4 space-y-3"
        >
          <div>
            <label className="text-xs text-gray-500 mb-1 block">종목 ID (ticker_id)</label>
            <input
              type="text"
              value={form.ticker_id}
              onChange={(e) => setForm({ ...form, ticker_id: e.target.value })}
              placeholder="예: uuid 값"
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#3182F6]"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'buy' })}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                form.type === 'buy'
                  ? 'bg-[#F04452] text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              매수
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'sell' })}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                form.type === 'sell'
                  ? 'bg-[#3182F6] text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              매도
            </button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">수량</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="0"
                min="1"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#3182F6]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">가격</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                min="1"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#3182F6]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">날짜</label>
            <input
              type="date"
              value={form.recorded_at}
              onChange={(e) => setForm({ ...form, recorded_at: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#3182F6]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">메모 (선택)</label>
            <input
              type="text"
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              placeholder="간단한 메모"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#3182F6]"
            />
          </div>
          {formError && (
            <p className="text-xs text-red-500">{formError}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gray-900 text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? '저장 중...' : '저장'}
          </button>
        </form>
      )}

      {/* 목록 */}
      {records.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-sm text-gray-400">매매기록이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((record) => {
            const isDeleting = deletingId === record.id
            const isBuy = record.type === 'buy'
            const dateStr = new Date(record.recorded_at).toLocaleDateString('ko-KR', {
              month: 'numeric',
              day: 'numeric',
            })

            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                        isBuy
                          ? 'bg-red-50 text-[#F04452]'
                          : 'bg-blue-50 text-[#3182F6]'
                      }`}
                    >
                      {isBuy ? '매수' : '매도'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {record.ticker?.name ?? record.ticker_id}
                    </span>
                    {record.ticker?.symbol && (
                      <span className="text-xs text-gray-400">{record.ticker.symbol}</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <span>{record.quantity}주</span>
                    <span>·</span>
                    <span>{record.price.toLocaleString()}원</span>
                    <span>·</span>
                    <span>{dateStr}</span>
                  </div>
                  {record.memo && (
                    <p className="mt-0.5 text-xs text-gray-300 truncate">{record.memo}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(record.id)}
                  disabled={isDeleting}
                  className="ml-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  aria-label="매매기록 삭제"
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
      )}
    </div>
  )
}
