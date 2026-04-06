// @TASK P4-회사분석 - 재무제표 분석 카드 (CSS 바 차트, 라이브러리 없음)
'use client'

import { useState } from 'react'

interface FinancialAnalysisProps {
  symbol: string
  per?: number | null
  pbr?: number | null
  eps?: number | null
}

interface YearlyFinancial {
  year: string
  revenue: number   // 단위: 억
  operatingProfit: number
  netProfit: number
}

interface FinancialMock {
  data: YearlyFinancial[]
  debtRatio: number  // %
}

const FINANCIAL_DATA: Record<string, FinancialMock> = {
  NVDA: {
    data: [
      { year: '2022', revenue: 269_140, operatingProfit: 47_980, netProfit: 43_320 },
      { year: '2023', revenue: 449_990, operatingProfit: 207_820, netProfit: 168_140 },
      { year: '2024', revenue: 1_305_890, operatingProfit: 812_730, netProfit: 729_700 },
    ],
    debtRatio: 42,
  },
  AAPL: {
    data: [
      { year: '2022', revenue: 5_154_350, operatingProfit: 1_195_370, netProfit: 999_030 },
      { year: '2023', revenue: 5_012_870, operatingProfit: 1_143_010, netProfit: 970_000 },
      { year: '2024', revenue: 5_224_870, operatingProfit: 1_222_610, netProfit: 1_040_000 },
    ],
    debtRatio: 58,
  },
  MSFT: {
    data: [
      { year: '2022', revenue: 2_628_200, operatingProfit: 837_830, netProfit: 729_380 },
      { year: '2023', revenue: 2_915_600, operatingProfit: 966_010, netProfit: 823_970 },
      { year: '2024', revenue: 3_358_840, operatingProfit: 1_194_010, netProfit: 1_005_690 },
    ],
    debtRatio: 35,
  },
  '005930': {
    data: [
      { year: '2022', revenue: 3_022_140, operatingProfit: 433_770, netProfit: 554_470 },
      { year: '2023', revenue: 2_589_280, operatingProfit: 64_760, netProfit: 154_870 },
      { year: '2024', revenue: 3_002_310, operatingProfit: 323_440, netProfit: 341_970 },
    ],
    debtRatio: 26,
  },
  '000660': {
    data: [
      { year: '2022', revenue: 443_230, operatingProfit: 60_970, netProfit: 39_580 },
      { year: '2023', revenue: 326_030, operatingProfit: -113_290, netProfit: -73_490 },
      { year: '2024', revenue: 430_920, operatingProfit: 23_510, netProfit: 8_190 },
    ],
    debtRatio: 44,
  },
}

const DEFAULT_FINANCIAL: FinancialMock = {
  data: [
    { year: '2022', revenue: 100_000, operatingProfit: 10_000, netProfit: 7_000 },
    { year: '2023', revenue: 110_000, operatingProfit: 12_000, netProfit: 8_000 },
    { year: '2024', revenue: 125_000, operatingProfit: 14_000, netProfit: 9_500 },
  ],
  debtRatio: 40,
}

// ── 툴팁 컴포넌트 ──────────────────────────────────────────────
const TOOLTIPS: Record<string, string> = {
  PER: '주가 ÷ 주당순이익. 숫자가 낮을수록 저평가일 수 있어요.',
  PBR: '주가 ÷ 주당순자산. 1 미만이면 자산보다 싸게 사는 셈이에요.',
  EPS: '1주당 기업이 벌어들인 순이익이에요.',
  부채비율: '총부채 ÷ 자기자본. 낮을수록 재무 안정성이 높아요.',
}

function TooltipLabel({ label }: { label: string }) {
  const [show, setShow] = useState(false)
  const tip = TOOLTIPS[label]

  return (
    <span className="relative inline-flex items-center gap-1">
      <span className="text-xs text-gray-400">{label}</span>
      {tip && (
        <button
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
          className="text-[10px] w-4 h-4 rounded-full bg-gray-100 text-gray-400 inline-flex items-center justify-center leading-none"
          aria-label={`${label} 설명`}
        >
          ?
        </button>
      )}
      {show && tip && (
        <span
          role="tooltip"
          className="absolute left-0 bottom-full mb-1.5 z-20 w-52 text-[11px] leading-relaxed bg-gray-900 text-white rounded-lg px-3 py-2 shadow-lg whitespace-normal"
        >
          {tip}
        </span>
      )}
    </span>
  )
}

// ── 바 차트 ────────────────────────────────────────────────────
function BarChart({ data }: { data: YearlyFinancial[] }) {
  const maxRevenue = Math.max(...data.map((d) => Math.abs(d.revenue)))

  return (
    <div className="mt-3 flex flex-col gap-3">
      {data.map((d, i) => {
        const prev = i > 0 ? data[i - 1] : null
        const revGrowth =
          prev && prev.revenue !== 0
            ? ((d.revenue - prev.revenue) / Math.abs(prev.revenue)) * 100
            : null
        const opPositive = d.operatingProfit >= 0

        return (
          <div key={d.year} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600">{d.year}</span>
              {revGrowth !== null && (
                <span
                  className={`text-[10px] font-semibold ${revGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}
                >
                  {revGrowth >= 0 ? '▲' : '▼'} {Math.abs(revGrowth).toFixed(1)}%
                </span>
              )}
            </div>

            {/* 매출 바 */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-10 shrink-0">매출</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${(d.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 w-14 text-right shrink-0">
                {(d.revenue / 1_0000).toFixed(0)}조
              </span>
            </div>

            {/* 영업이익 바 */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 w-10 shrink-0">영업익</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${opPositive ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{
                    width: `${(Math.abs(d.operatingProfit) / maxRevenue) * 100}%`,
                  }}
                />
              </div>
              <span
                className={`text-[10px] w-14 text-right shrink-0 ${opPositive ? 'text-green-600' : 'text-red-500'}`}
              >
                {opPositive ? '' : '-'}{(Math.abs(d.operatingProfit) / 1_0000).toFixed(1)}조
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────
export default function FinancialAnalysis({
  symbol,
  per,
  pbr,
  eps,
}: FinancialAnalysisProps) {
  const fin = FINANCIAL_DATA[symbol] ?? DEFAULT_FINANCIAL

  const latestData = fin.data[fin.data.length - 1]
  const prevData = fin.data[fin.data.length - 2]

  function calcGrowth(curr: number, prev: number) {
    if (!prev) return null
    return ((curr - prev) / Math.abs(prev)) * 100
  }

  const opGrowth = calcGrowth(latestData.operatingProfit, prevData.operatingProfit)

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">재무 분석</h3>
      <p className="text-xs text-gray-400 mb-3">최근 3개년 연간 기준</p>

      {/* 바 차트 */}
      <BarChart data={fin.data} />

      {/* 구분선 */}
      <div className="border-t border-gray-100 my-4" />

      {/* 핵심 비율 */}
      <h4 className="text-xs font-semibold text-gray-600 mb-3">핵심 투자 지표</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5">
          <TooltipLabel label="PER" />
          <span className="text-sm font-semibold text-gray-900">
            {per != null ? `${per.toFixed(2)}배` : '-'}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <TooltipLabel label="PBR" />
          <span className="text-sm font-semibold text-gray-900">
            {pbr != null ? `${pbr.toFixed(2)}배` : '-'}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <TooltipLabel label="EPS" />
          <span className="text-sm font-semibold text-gray-900">
            {eps != null ? eps.toLocaleString() : '-'}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <TooltipLabel label="부채비율" />
          <span className="text-sm font-semibold text-gray-900">{fin.debtRatio}%</span>
        </div>
      </div>

      {/* 전년 대비 */}
      {opGrowth !== null && (
        <div className="mt-3 bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500">
            전년 대비 영업이익{' '}
            <span
              className={`font-semibold ${opGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}
            >
              {opGrowth >= 0 ? '▲' : '▼'} {Math.abs(opGrowth).toFixed(1)}%
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
