// @TASK P3-S4-T2 - AI 인과 분석 카드
// NOTE: ticker_details에 캐시됨. POST /api/tickers/[symbol]/ai-analysis 로 갱신.
'use client'

import { useState } from 'react'

interface AICausalAnalysisProps {
  symbol: string
  aiCausalStory: string | null
  aiEarningsSummary: string | null
  aiOpinion: 'buy_consider' | 'caution' | 'hold' | null
  aiOpinionReason: string[] | null
  analyzedAt: string | null
}

const OPINION_STYLE: Record<string, { label: string; className: string }> = {
  buy_consider: { label: '매수 고려', className: 'bg-green-100 text-green-700' },
  caution: { label: '주의', className: 'bg-red-100 text-red-700' },
  hold: { label: '보유', className: 'bg-yellow-100 text-yellow-700' },
}

export default function AICausalAnalysis({
  symbol,
  aiCausalStory,
  aiEarningsSummary,
  aiOpinion,
  aiOpinionReason,
  analyzedAt,
}: AICausalAnalysisProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRefresh() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/tickers/${symbol}/ai-analysis`, { method: 'POST' })
      if (!res.ok) throw new Error('AI 분석 요청 실패')
      // 부모 페이지 리로드로 갱신
      window.location.reload()
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류 발생')
    } finally {
      setLoading(false)
    }
  }

  const opinion = aiOpinion ? OPINION_STYLE[aiOpinion] : null

  return (
    <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-blue-900">AI 인과 분석</h3>
        <div className="flex items-center gap-2">
          {opinion && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${opinion.className}`}>
              {opinion.label}
            </span>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="text-xs text-blue-600 hover:underline disabled:opacity-50"
          >
            {loading ? '분석 중...' : '새로 분석'}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      {aiCausalStory ? (
        <p className="text-sm text-gray-700 leading-relaxed">{aiCausalStory}</p>
      ) : (
        <p className="text-sm text-gray-400">AI 분석 결과가 없습니다. &apos;새로 분석&apos;을 눌러주세요.</p>
      )}

      {aiEarningsSummary && (
        <p className="mt-2 text-xs text-gray-500">{aiEarningsSummary}</p>
      )}

      {aiOpinionReason && aiOpinionReason.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {aiOpinionReason.map((reason, i) => (
            <li key={i} className="text-xs text-gray-500 flex gap-1">
              <span className="text-blue-400">•</span>
              {reason}
            </li>
          ))}
        </ul>
      )}

      {analyzedAt && (
        <p className="mt-3 text-[10px] text-gray-400">
          분석 시각: {new Date(analyzedAt).toLocaleString('ko-KR')}
        </p>
      )}
    </div>
  )
}
