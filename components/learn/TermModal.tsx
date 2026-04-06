'use client'

import { useEffect, useCallback } from 'react'
import {
  GlossaryTerm,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/lib/learn/glossary-data'

interface FormulaBoxProps {
  termId: string
}

function FormulaBox({ termId }: FormulaBoxProps) {
  const formulas: Record<string, { label: string; parts: string[] }> = {
    per: {
      label: 'PER 공식',
      parts: ['PER', '=', '주가', '÷', 'EPS (주당순이익)'],
    },
    pbr: {
      label: 'PBR 공식',
      parts: ['PBR', '=', '주가', '÷', 'BPS (주당순자산)'],
    },
    roe: {
      label: 'ROE 공식',
      parts: ['ROE', '=', '순이익', '÷', '자기자본', '×', '100'],
    },
    '부채비율': {
      label: '부채비율 공식',
      parts: ['부채비율', '=', '총부채', '÷', '자기자본', '×', '100'],
    },
  }

  const formula = formulas[termId]
  if (!formula) return null

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-500">
        {formula.label}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {formula.parts.map((part, i) => {
          const isOperator = ['=', '÷', '×'].includes(part)
          return (
            <span
              key={i}
              className={
                isOperator
                  ? 'text-lg font-bold text-blue-400'
                  : 'rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm'
              }
            >
              {part}
            </span>
          )
        })}
      </div>
    </div>
  )
}

interface TermModalProps {
  term: GlossaryTerm | null
  onClose: () => void
  onTermClick: (termId: string) => void
}

export default function TermModal({ term, onClose, onTermClick }: TermModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!term) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [term, handleKeyDown])

  if (!term) return null

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 모달 패널 — 모바일: 하단 시트 / 데스크톱: 중앙 모달 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="term-modal-title"
        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl
                   md:inset-0 md:m-auto md:h-fit md:max-h-[80vh] md:max-w-xl md:rounded-2xl"
      >
        {/* 헤더 */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-100 bg-white px-5 py-4">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="term-modal-title"
                className="text-xl font-bold text-gray-900"
              >
                {term.term}
              </h2>
              {term.term_en && (
                <span className="text-sm text-gray-400">{term.term_en}</span>
              )}
            </div>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                CATEGORY_COLORS[term.category]
              }`}
            >
              {CATEGORY_LABELS[term.category]}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 본문 */}
        <div className="space-y-5 px-5 py-5">
          {/* 한 줄 정의 */}
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              한 줄 정의
            </p>
            <p className="text-sm font-medium leading-relaxed text-gray-800">
              {term.short_def}
            </p>
          </div>

          {/* 공식 (has_visual & formula) */}
          {term.has_visual && term.visual_type === 'formula' && (
            <FormulaBox termId={term.id} />
          )}

          {/* 상세 설명 */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              상세 설명
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              {term.full_explanation}
            </p>
          </div>

          {/* 예시 */}
          {term.example && (
            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-500">
                예시
              </p>
              <p className="text-sm leading-relaxed text-gray-700">
                {term.example}
              </p>
            </div>
          )}

          {/* 관련 용어 */}
          {term.related_terms && term.related_terms.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                관련 용어
              </p>
              <div className="flex flex-wrap gap-2">
                {term.related_terms.map((relId) => (
                  <button
                    key={relId}
                    onClick={() => onTermClick(relId)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    {relId.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 드래그 핸들 (모바일) */}
        <div className="flex justify-center pb-4 pt-1 md:hidden">
          <div className="h-1 w-12 rounded-full bg-gray-200" aria-hidden="true" />
        </div>
      </div>
    </>
  )
}
