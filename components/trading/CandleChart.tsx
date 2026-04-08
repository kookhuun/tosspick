'use client'

// @TASK T-TRADING - SVG 캔들스틱 차트 (라이브러리 없이 직접 구현)

import { useMemo } from 'react'
import type { CandleData } from '@/lib/trading/chart-generator'

interface CandleChartProps {
  candles: CandleData[]
  width?: number
  height?: number
  showVolume?: boolean
}

const PADDING = { top: 16, right: 48, bottom: 24, left: 8 }
const VOLUME_HEIGHT_RATIO = 0.2
const BULL_COLOR = '#ef4444' // 양봉: 빨강 (한국식)
const BEAR_COLOR = '#3182F6' // 음봉: 파랑 (한국식)

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('ko-KR')
  return price.toFixed(2)
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function CandleChart({
  candles,
  height = 300,
  showVolume = true,
}: CandleChartProps) {
  const VW = 800 // viewBox 너비 (반응형)

  const chartData = useMemo(() => {
    if (candles.length === 0) return null

    const mainHeight = showVolume ? VW * (height / 800) * (1 - VOLUME_HEIGHT_RATIO) : VW * (height / 800)
    const volHeight = showVolume ? VW * (height / 800) * VOLUME_HEIGHT_RATIO : 0
    const VH = mainHeight + volHeight

    const priceMin = Math.min(...candles.map((c) => c.low))
    const priceMax = Math.max(...candles.map((c) => c.high))
    const priceRange = priceMax - priceMin || 1
    const volMax = Math.max(...candles.map((c) => c.volume)) || 1

    const plotLeft = PADDING.left
    const plotRight = VW - PADDING.right
    const plotTop = PADDING.top
    const plotBottom = mainHeight - PADDING.bottom
    const plotWidth = plotRight - plotLeft
    const plotMainHeight = plotBottom - plotTop

    const candleWidth = Math.max(2, plotWidth / candles.length - 1)
    const gap = plotWidth / candles.length

    function xPos(i: number): number {
      return plotLeft + i * gap + gap / 2
    }

    function yPrice(price: number): number {
      return plotTop + plotMainHeight * (1 - (price - priceMin) / priceRange)
    }

    function yVol(vol: number): number {
      return mainHeight + volHeight * (1 - vol / volMax)
    }

    // Y축 눈금 (5개)
    const yTicks: { price: number; y: number }[] = []
    for (let i = 0; i <= 4; i++) {
      const price = priceMin + (priceRange * i) / 4
      yTicks.push({ price, y: yPrice(price) })
    }

    // X축 눈금 (최대 6개)
    const xStep = Math.max(1, Math.floor(candles.length / 6))
    const xTicks: { time: number; x: number }[] = []
    for (let i = 0; i < candles.length; i += xStep) {
      xTicks.push({ time: candles[i].time as any, x: xPos(i) })
    }

    const lastCandle = candles[candles.length - 1]
    const lastPriceY = yPrice(lastCandle.close)
    const isBull = lastCandle.close >= lastCandle.open

    return {
      VH,
      mainHeight,
      volHeight,
      candleWidth,
      gap,
      xPos,
      yPrice,
      yVol,
      yTicks,
      xTicks,
      lastCandle,
      lastPriceY,
      isBull,
      plotLeft,
      plotRight,
      plotTop,
      plotBottom,
    }
  }, [candles, height, showVolume])

  if (!chartData || candles.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-950 rounded-lg text-gray-500 text-sm"
        style={{ height }}
      >
        데이터 없음
      </div>
    )
  }

  const {
    VH,
    mainHeight,
    volHeight,
    candleWidth,
    xPos,
    yPrice,
    yVol,
    yTicks,
    xTicks,
    lastCandle,
    lastPriceY,
    isBull,
    plotLeft,
    plotRight,
    plotBottom,
  } = chartData

  return (
    <div className="w-full bg-gray-950 rounded-lg overflow-hidden">
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        height={height}
        className="block"
        aria-label="캔들스틱 차트"
      >
        {/* 배경 그리드 */}
        {yTicks.map((tick, i) => (
          <line
            key={i}
            x1={plotLeft}
            y1={tick.y}
            x2={plotRight}
            y2={tick.y}
            stroke="#1f2937"
            strokeWidth="1"
          />
        ))}

        {/* Y축 가격 레이블 */}
        {yTicks.map((tick, i) => (
          <text
            key={i}
            x={VW - 4}
            y={tick.y + 4}
            textAnchor="end"
            fontSize="11"
            fill="#6b7280"
          >
            {formatPrice(tick.price)}
          </text>
        ))}

        {/* X축 시간 레이블 */}
        {xTicks.map((tick, i) => (
          <text
            key={i}
            x={tick.x}
            y={plotBottom + 16}
            textAnchor="middle"
            fontSize="10"
            fill="#6b7280"
          >
            {formatTime(tick.time)}
          </text>
        ))}

        {/* 캔들스틱 */}
        {candles.map((c, i) => {
          const x = xPos(i)
          const bull = c.close >= c.open
          const color = bull ? BULL_COLOR : BEAR_COLOR
          const bodyTop = yPrice(Math.max(c.open, c.close))
          const bodyBot = yPrice(Math.min(c.open, c.close))
          const bodyH = Math.max(1, bodyBot - bodyTop)

          return (
            <g key={i}>
              {/* 심지 (wick) */}
              <line
                x1={x}
                y1={yPrice(c.high)}
                x2={x}
                y2={yPrice(c.low)}
                stroke={color}
                strokeWidth="1"
              />
              {/* 몸통 (body) */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyH}
                fill={color}
              />
            </g>
          )
        })}

        {/* 현재가 점선 */}
        <line
          x1={plotLeft}
          y1={lastPriceY}
          x2={plotRight}
          y2={lastPriceY}
          stroke={isBull ? BULL_COLOR : BEAR_COLOR}
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.7"
        />
        {/* 현재가 레이블 박스 */}
        <rect
          x={plotRight - 2}
          y={lastPriceY - 9}
          width={VW - plotRight + 2}
          height={18}
          fill={isBull ? BULL_COLOR : BEAR_COLOR}
          rx="2"
        />
        <text
          x={VW - 4}
          y={lastPriceY + 4}
          textAnchor="end"
          fontSize="11"
          fill="white"
          fontWeight="600"
        >
          {formatPrice(lastCandle.close)}
        </text>

        {/* 거래량 바 */}
        {showVolume &&
          candles.map((c, i) => {
            const x = xPos(i)
            const bull = c.close >= c.open
            const color = bull ? BULL_COLOR : BEAR_COLOR
            const barTop = yVol(c.volume)
            const barH = Math.max(1, mainHeight + volHeight - barTop)

            return (
              <rect
                key={`v${i}`}
                x={x - candleWidth / 2}
                y={barTop}
                width={candleWidth}
                height={barH}
                fill={color}
                opacity="0.5"
              />
            )
          })}
      </svg>
    </div>
  )
}
