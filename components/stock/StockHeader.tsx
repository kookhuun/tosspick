'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface TickerData {
  symbol: string
  name: string
  current_price: number
  price_change: number
  price_change_rate: number
  market: string
}

interface StockHeaderProps {
  ticker: TickerData
  isLoggedIn: boolean
}

export default function StockHeader({ ticker, isLoggedIn }: StockHeaderProps) {
  const router = useRouter()
  const [viewers, setViewers] = useState(0)
  
  const isPositive = ticker.price_change_rate >= 0
  const colorClass = isPositive ? 'text-[#f04452]' : 'text-[#3182f6]'

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 500) + 120)
  }, [])

  return (
    <header className="bg-white px-5 pt-10 pb-6 border-b border-gray-50 animate-toss-in">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-black text-gray-900 tracking-tight">{ticker.name}</h1>
              <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{ticker.symbol}</span>
            </div>
            <p className="text-[12px] font-bold text-[#3182f6] flex items-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              지금 {viewers}명이 함께 보고 있어요
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl toss-pressable">
              ⭐
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[32px] font-black text-gray-900 tabular-nums tracking-tighter">
              ₩{ticker.current_price.toLocaleString()}
            </span>
            <span className={`text-[15px] font-bold ${colorClass}`}>
              {isPositive ? '▲' : '▼'} {Math.abs(ticker.price_change).toLocaleString()} ({isPositive ? '+' : ''}{ticker.price_change_rate}%)
            </span>
          </div>
          
          {/* 행동 유도 버튼: 훈련소로 바로가기 */}
          <button 
            onClick={() => router.push(`/trading?symbol=${ticker.symbol}`)}
            className="w-full py-4 bg-blue-600 text-white rounded-[20px] text-sm font-black shadow-lg shadow-blue-100 toss-pressable flex items-center justify-center gap-2"
          >
            🎯 이 종목으로 투자 훈련하기
          </button>

          <div className="bg-[#f9fafb] p-5 rounded-[24px] flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">
              🛡️
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-black text-gray-800">안전한 훈련 환경</p>
              <p className="text-[11px] font-bold text-gray-400">실수해도 내 자산은 깎이지 않아요</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
