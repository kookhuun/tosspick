'use client'

import { useState, useEffect, useMemo } from 'react'
import { generateInitialCandles, generateNextTick, type CandleData } from '@/lib/trading/chart-generator'

interface PriceChartProps {
  chartData?: any
  basePrice?: number
}

export default function PriceChart({ chartData, basePrice = 75000 }: PriceChartProps) {
  const [data, setData] = useState<CandleData[]>([])
  const [showGuide, setShowGuide] = useState(false)

  // 1. 초기 데이터 생성
  useEffect(() => {
    const initial = generateInitialCandles(40, basePrice)
    setData(initial)
  }, [basePrice])

  // 2. 실시간 Tick 업데이트 (1초마다)
  useEffect(() => {
    if (data.length === 0) return

    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1]
        const next = generateNextTick(last)
        return [...prev.slice(0, -1), next]
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [data.length])

  // 3. SVG 경로 계산 (선 그래프)
  const chartPath = useMemo(() => {
    if (data.length === 0) return ""
    const max = Math.max(...data.map(d => d.high))
    const min = Math.min(...data.map(d => d.low))
    const range = max - min
    const width = 1000
    const height = 200

    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((d.close - min) / range) * height
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }, [data])

  const isPositive = data.length > 0 && data[data.length - 1].close >= data[0].close

  return (
    <div className="relative w-full bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm overflow-hidden flex flex-col gap-4 animate-toss-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">실시간 시세 훈련</h3>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-bold text-red-500 uppercase">Live</span>
        </div>
      </div>

      {/* 실시간 SVG 선 그래프 */}
      <div className="relative h-[200px] w-full">
        <svg 
          viewBox="0 0 1000 200" 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* 가이드 라인 */}
          <line x1="0" y1="100" x2="1000" y2="100" stroke="#f2f4f6" strokeWidth="1" strokeDasharray="4" />
          
          {/* 메인 시세 선 */}
          <path
            d={chartPath}
            fill="none"
            stroke={isPositive ? "#f04452" : "#3182f6"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-1000"
          />
          
          {/* 현재가 포인터 */}
          {data.length > 0 && (
            <circle
              cx="1000"
              cy={200 - ((data[data.length - 1].close - Math.min(...data.map(d => d.low))) / (Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low)))) * 200}
              r="5"
              fill={isPositive ? "#f04452" : "#3182f6"}
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      <div className="flex justify-between items-center mt-2">
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[10px] font-black rounded-full hover:bg-gray-100 transition-colors"
        >
          이 차트 읽는 법
        </button>
        <p className="text-[11px] font-black text-gray-900 tabular-nums">
          현재가: ₩{data[data.length - 1]?.close.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      {/* 가이드 오버레이 */}
      {showGuide && (
        <div className="absolute inset-0 bg-blue-600/95 backdrop-blur-sm z-20 p-8 flex flex-col text-white animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-black">차트가 꿈틀대나요?</h4>
            <button onClick={() => setShowGuide(false)} className="text-2xl">✕</button>
          </div>
          <p className="text-sm font-bold leading-relaxed">
            실제 시장처럼 1초마다 가격이 변하고 있어요.<br /><br />
            빨간색 선은 시작보다 올랐다는 뜻,<br />
            파란색 선은 떨어졌다는 뜻이에요.<br /><br />
            움직이는 끝점을 보며 매수 타이밍을 잡아보세요!
          </p>
          <button 
            onClick={() => setShowGuide(false)}
            className="mt-auto py-4 bg-white text-blue-600 rounded-2xl text-sm font-black"
          >
            알겠어요!
          </button>
        </div>
      )}
    </div>
  )
}
