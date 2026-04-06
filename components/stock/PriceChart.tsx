// @TASK P3-S4-T1 - 기간별 주가 차트 (1일/1주/1개월/3개월/1년)
// NOTE: chart_data는 ticker_details.chart_data (jsonb) 에 저장.
//       외부 툴이 주기적으로 갱신. 차트 라이브러리는 추후 연동.
'use client'

import { useState } from 'react'

export type ChartPeriod = '1d' | '1w' | '1m' | '3m' | '1y'

interface PriceChartProps {
  // chart_data: { [period: ChartPeriod]: { t: number; v: number }[] }
  chartData: Record<string, unknown>
}

const PERIODS: { key: ChartPeriod; label: string }[] = [
  { key: '1d', label: '1일' },
  { key: '1w', label: '1주' },
  { key: '1m', label: '1개월' },
  { key: '3m', label: '3개월' },
  { key: '1y', label: '1년' },
]

export default function PriceChart({ chartData }: PriceChartProps) {
  const [period, setPeriod] = useState<ChartPeriod>('1m')
  const periodData = chartData[period]

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      {/* 기간 탭 */}
      <div className="flex gap-1 mb-3">
        {PERIODS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              period === key
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 차트 영역 — TODO: recharts 또는 lightweight-charts 연동 */}
      <div className="h-40 flex items-center justify-center bg-gray-50 rounded-lg text-sm text-gray-400">
        {periodData ? '차트 데이터 있음 (라이브러리 연동 필요)' : '차트 데이터 없음'}
      </div>
    </div>
  )
}
