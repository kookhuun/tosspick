'use client'

// @TASK T-TRADING - 랜덤 종목 캔들차트 + 매수/매도

import { useState, useEffect, useRef, useCallback } from 'react'
import CandleChart from '@/components/trading/CandleChart'
import { generateInitialCandles, generateNextCandle, type CandleData } from '@/lib/trading/chart-generator'
import { buyStock, sellStock } from '@/lib/trading/virtual-balance'

const SPEED_MAP: Record<number, number> = {
  1: 1000,
  2: 500,
  4: 250,
  8: 125,
}

const RAND_SYMBOL = `#RAND-${Math.floor(Math.random() * 9000 + 1000)}`
const BASE_PRICE = Math.floor(Math.random() * 90000 + 10000)
const INITIAL_COUNT = 80

interface TradeForm {
  price: string
  quantity: string
}

export default function RandomChartTab({ onBalanceChange }: { onBalanceChange?: () => void }) {
  const [candles, setCandles] = useState<CandleData[]>([])
  const [historyStack, setHistoryStack] = useState<CandleData[][]>([])
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState<1 | 2 | 4 | 8>(1)
  const [form, setForm] = useState<TradeForm>({ price: '', quantity: '' })
  const [message, setMessage] = useState<string | null>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const candlesRef = useRef<CandleData[]>([])
  const historyRef = useRef<CandleData[][]>([])

  // 캔들 초기화
  useEffect(() => {
    const initial = generateInitialCandles(INITIAL_COUNT, BASE_PRICE)
    setCandles(initial)
    candlesRef.current = initial
    // 현재가를 폼 기본값으로
    const last = initial[initial.length - 1]
    setForm({ price: String(Math.round(last.close)), quantity: '1' })
  }, [])

  const tick = useCallback(() => {
    const prev = candlesRef.current
    if (prev.length === 0) return
    const next = generateNextCandle(prev[prev.length - 1])

    // 히스토리 저장 (최대 200 스냅샷)
    const newHistory = [...historyRef.current, [...prev]]
    if (newHistory.length > 200) newHistory.shift()
    historyRef.current = newHistory
    setHistoryStack(newHistory)

    const updated = [...prev, next].slice(-200)
    candlesRef.current = updated
    setCandles(updated)
    setForm((f) => ({ ...f, price: String(Math.round(next.close)) }))
  }, [])

  // 재생/일시정지/배속 관리
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (playing && candlesRef.current.length > 0) {
      intervalRef.current = setInterval(tick, SPEED_MAP[speed])
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing, speed, tick])

  function handleBack() {
    if (historyRef.current.length === 0) return
    const prev = [...historyRef.current]
    const snapshot = prev.pop()!
    historyRef.current = prev
    setHistoryStack(prev)
    candlesRef.current = snapshot
    setCandles(snapshot)
    const last = snapshot[snapshot.length - 1]
    setForm((f) => ({ ...f, price: String(Math.round(last.close)) }))
  }

  function showMessage(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(null), 2500)
  }

  function handleBuy() {
    const price = parseFloat(form.price)
    const qty = parseInt(form.quantity, 10)
    if (!price || !qty || qty <= 0) return showMessage('가격과 수량을 입력해주세요.')
    const ok = buyStock(RAND_SYMBOL, `랜덤종목 ${RAND_SYMBOL}`, price, qty)
    if (ok) {
      showMessage(`매수 완료: ${qty}주 @ ₩${price.toLocaleString()}`)
      onBalanceChange?.()
    } else {
      showMessage('잔고가 부족합니다.')
    }
  }

  function handleSell() {
    const price = parseFloat(form.price)
    const qty = parseInt(form.quantity, 10)
    if (!price || !qty || qty <= 0) return showMessage('가격과 수량을 입력해주세요.')
    const ok = sellStock(RAND_SYMBOL, price, qty)
    if (ok) {
      showMessage(`매도 완료: ${qty}주 @ ₩${price.toLocaleString()}`)
      onBalanceChange?.()
    } else {
      showMessage('보유 수량이 부족합니다.')
    }
  }

  const lastCandle = candles[candles.length - 1]
  const firstCandle = candles[0]
  const priceChange = lastCandle && firstCandle ? lastCandle.close - firstCandle.close : 0
  const changeRate = firstCandle ? (priceChange / firstCandle.close) * 100 : 0
  const isPositive = priceChange >= 0

  return (
    <div className="flex flex-col gap-4">
      {/* 종목 헤더 */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="text-lg font-bold text-gray-800">{RAND_SYMBOL}</span>
        {lastCandle && (
          <>
            <span className="text-2xl font-bold text-gray-900">
              ₩{Math.round(lastCandle.close).toLocaleString('ko-KR')}
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-red-500' : 'text-blue-500'}`}>
              {isPositive ? '+' : ''}
              {Math.round(priceChange).toLocaleString('ko-KR')} ({isPositive ? '+' : ''}
              {changeRate.toFixed(2)}%) 오늘
            </span>
          </>
        )}
      </div>

      {/* 차트 */}
      <CandleChart candles={candles} height={280} showVolume />

      {/* 컨트롤 */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleBack}
          disabled={historyStack.length === 0}
          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-sm font-medium text-gray-700 transition-colors"
          aria-label="뒤로 감기"
        >
          &#9664;&#9664; 뒤로
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
          aria-label={playing ? '일시정지' : '재개'}
        >
          {playing ? '⏸ 일시정지' : '▶ 재개'}
        </button>

        <div className="flex gap-1 ml-2">
          {([1, 2, 4, 8] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                speed === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-pressed={speed === s}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* 매수/매도 폼 */}
      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500" htmlFor="rand-price">
            매수/매도가 (₩)
          </label>
          <input
            id="rand-price"
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500" htmlFor="rand-qty">
            수량
          </label>
          <input
            id="rand-qty"
            type="number"
            value={form.quantity}
            onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
            className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>
        <button
          onClick={handleBuy}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
        >
          매수
        </button>
        <button
          onClick={handleSell}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
        >
          매도
        </button>
      </div>

      {/* 메시지 토스트 */}
      {message && (
        <div className="rounded-lg bg-gray-800 text-white text-sm px-4 py-2.5 font-medium">
          {message}
        </div>
      )}
    </div>
  )
}
