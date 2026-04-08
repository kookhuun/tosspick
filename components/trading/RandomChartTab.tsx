'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import CandleChart from '@/components/trading/CandleChart'
import { generateInitialCandles, generateNextTick, type CandleData } from '@/lib/trading/chart-generator'
import { buyStock, sellStock } from '@/lib/trading/virtual-balance'

const SPEED_MAP: Record<number, number> = {
  1: 1000,
  2: 500,
  4: 250,
  8: 125,
}

const RAND_SYMBOL = `#RAND-${Math.floor(Math.random() * 9000 + 1000)}`
const BASE_PRICE = Math.floor(Math.random() * 90000 + 10000)
const INITIAL_COUNT = 60

export default function RandomChartTab({ onBalanceChange }: { onBalanceChange?: () => void }) {
  const [candles, setCandles] = useState<CandleData[]>([])
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState<1 | 2 | 4 | 8>(1)
  const [message, setMessage] = useState<string | null>(null)

  const candlesRef = useRef<CandleData[]>([])

  // 초기 로드
  useEffect(() => {
    const initial = generateInitialCandles(INITIAL_COUNT, BASE_PRICE)
    setCandles(initial)
    candlesRef.current = initial
  }, [])

  // 실시간 틱 업데이트
  useEffect(() => {
    if (!playing) return

    const interval = setInterval(() => {
      const prev = candlesRef.current
      if (prev.length === 0) return

      const last = prev[prev.length - 1]
      const nextTick = generateNextTick(last)
      
      const updated = [...prev.slice(0, -1), nextTick]
      candlesRef.current = updated
      setCandles(updated)
    }, SPEED_MAP[speed])

    return () => clearInterval(interval)
  }, [playing, speed])

  // 매분 새로운 캔들 생성 (시뮬레이션)
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      const prev = candlesRef.current
      if (prev.length === 0) return
      
      const last = prev[prev.length - 1]
      const newCandle: CandleData = {
        time: new Date().toLocaleTimeString(),
        open: last.close,
        high: last.close,
        low: last.close,
        close: last.close,
        volume: Math.floor(Math.random() * 100)
      }
      
      const updated = [...prev, newCandle].slice(-100) // 최대 100개 유지
      candlesRef.current = updated
      setCandles(updated)
    }, 60000 / speed) // 실제로는 1분이지만 배속 적용

    return () => clearInterval(interval)
  }, [playing, speed])

  function showMessage(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(null), 2500)
  }

  function handleBuy() {
    const last = candles[candles.length - 1]
    if (!last) return
    const price = Math.round(last.close)
    const ok = buyStock(RAND_SYMBOL, `랜덤훈련 ${RAND_SYMBOL}`, price, 10)
    if (ok) {
      showMessage(`매수 완료: 10주 @ ₩${price.toLocaleString()}`)
      onBalanceChange?.()
    } else showMessage('잔고가 부족합니다.')
  }

  function handleSell() {
    const last = candles[candles.length - 1]
    if (!last) return
    const price = Math.round(last.close)
    const ok = sellStock(RAND_SYMBOL, price, 10)
    if (ok) {
      showMessage(`매도 완료: 10주 @ ₩${price.toLocaleString()}`)
      onBalanceChange?.()
    } else showMessage('보유 수량이 부족합니다.')
  }

  const lastCandle = candles[candles.length - 1]
  const firstCandle = candles[0]
  const priceChange = lastCandle && firstCandle ? lastCandle.close - firstCandle.close : 0
  const changeRate = firstCandle ? (priceChange / firstCandle.close) * 100 : 0

  return (
    <div className="flex flex-col gap-6 animate-toss-in">
      <div className="toss-card">
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{RAND_SYMBOL}</h3>
            {lastCandle && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900 tabular-nums">
                  ₩{Math.round(lastCandle.close).toLocaleString()}
                </span>
                <span className={`text-sm font-bold ${priceChange >= 0 ? 'text-[#f04452]' : 'text-[#3182f6]'}`}>
                  {priceChange >= 0 ? '+' : ''}{changeRate.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-1 bg-gray-50 p-1 rounded-xl">
            {([1, 2, 4, 8] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                  speed === s ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <CandleChart candles={candles} height={300} />

        <div className="flex gap-3 mt-8">
          <button 
            onClick={handleBuy}
            className="flex-1 py-4 bg-[#f04452] text-white rounded-2xl text-sm font-black shadow-lg shadow-red-100 toss-pressable"
          >
            살래요
          </button>
          <button 
            onClick={handleSell}
            className="flex-1 py-4 bg-[#3182f6] text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-100 toss-pressable"
          >
            팔래요
          </button>
        </div>
      </div>

      {message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl animate-in slide-in-from-top">
          {message}
        </div>
      )}
    </div>
  )
}
