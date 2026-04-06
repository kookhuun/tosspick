// @TASK P3-S4-T1 - 기본 지표 그리드 (PER/PBR/EPS/시가총액/거래량/배당률)
// NOTE: ticker_details 테이블에서 조회. 외부 툴이 주기적으로 갱신.

export interface TickerDetailData {
  per: number | null
  pbr: number | null
  eps: number | null
  dividend_rate: number | null
  market_cap?: number
  volume?: number
}

interface KeyIndicatorsProps {
  detail: TickerDetailData
}

const INDICATORS = [
  { key: 'per', label: 'PER', format: (v: number) => `${v.toFixed(2)}배` },
  { key: 'pbr', label: 'PBR', format: (v: number) => `${v.toFixed(2)}배` },
  { key: 'eps', label: 'EPS', format: (v: number) => `${v.toLocaleString()}원` },
  { key: 'dividend_rate', label: '배당률', format: (v: number) => `${v.toFixed(2)}%` },
  { key: 'market_cap', label: '시가총액', format: (v: number) => `${(v / 1e8).toFixed(0)}억` },
  { key: 'volume', label: '거래량', format: (v: number) => v.toLocaleString() },
] as const

export default function KeyIndicators({ detail }: KeyIndicatorsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">주요 지표</h3>
      <div className="grid grid-cols-2 gap-3">
        {INDICATORS.map(({ key, label, format }) => {
          const value = detail[key as keyof TickerDetailData]
          return (
            <div key={key} className="flex flex-col gap-0.5">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-sm font-semibold text-gray-900">
                {value != null ? format(value as number) : '-'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
