// @TASK P2-S2-T1
export interface FearGreedData {
  score: number
  label: string
}

const LABEL_MAP: Record<string, string> = {
  extreme_fear: '극도의 공포',
  fear: '공포',
  neutral: '중립',
  greed: '탐욕',
  extreme_greed: '극도의 탐욕',
}

export default function FearGreedGauge({ data }: { data: FearGreedData }) {
  const pct = Math.min(Math.max(data.score, 0), 100)
  const korLabel = LABEL_MAP[data.label] ?? data.label

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">공포탐욕 지수</h3>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20">
          <svg viewBox="0 0 36 36" className="rotate-[-90deg]">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke={pct > 55 ? '#16a34a' : pct > 44 ? '#d97706' : '#dc2626'}
              strokeWidth="3"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-900">{data.score}</span>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-700">{korLabel}</p>
      </div>
    </div>
  )
}
