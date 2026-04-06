'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  GlossaryTerm,
  GLOSSARY_TERMS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  groupTerms,
} from '@/lib/learn/glossary-data'
import TermModal from './TermModal'

type CategoryFilter = GlossaryTerm['category'] | 'all'

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'indicator', label: '지표' },
  { value: 'chart', label: '차트' },
  { value: 'fundamental', label: '펀더멘털' },
  { value: 'market', label: '시장' },
  { value: 'trading', label: '매매' },
  { value: 'general', label: '기타' },
]

export default function GlossaryClient() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null)

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return GLOSSARY_TERMS.filter((t) => {
      const matchCat = category === 'all' || t.category === category
      if (!matchCat) return false
      if (!q) return true
      return (
        t.term.toLowerCase().includes(q) ||
        (t.term_en?.toLowerCase().includes(q) ?? false) ||
        t.short_def.toLowerCase().includes(q)
      )
    })
  }, [query, category])

  const grouped = useMemo(() => groupTerms(filtered), [filtered])

  const handleTermClick = useCallback(
    (termId: string) => {
      const found = GLOSSARY_TERMS.find((t) => t.id === termId)
      if (found) setSelectedTerm(found)
    },
    []
  )

  return (
    <>
      {/* 검색창 */}
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white px-4 py-3 md:px-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="용어를 검색하세요 (예: PER, 이동평균선)"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          aria-label="용어 검색"
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="sticky top-[57px] z-10 overflow-x-auto border-b border-gray-100 bg-white">
        <div className="flex gap-1 px-4 py-2 md:px-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === c.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 결과 없음 */}
      {grouped.length === 0 && (
        <div className="py-20 text-center text-sm text-gray-400">
          <p className="mb-1 text-2xl">📭</p>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      {/* 가나다순 그룹 리스트 */}
      <div className="pb-24">
        {grouped.map(({ key, terms }) => (
          <section key={key}>
            {/* 그룹 헤더 */}
            <div className="sticky top-[105px] z-10 border-b border-gray-100 bg-gray-50 px-4 py-1.5 md:px-6">
              <span className="text-xs font-bold text-gray-400">{key}</span>
            </div>

            {/* 용어 행 */}
            <ul>
              {terms.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setSelectedTerm(t)}
                    className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-blue-50 active:bg-blue-100 md:px-6"
                    aria-label={`${t.term} 상세 보기`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {t.term}
                        </span>
                        {t.term_en && (
                          <span className="text-xs text-gray-400">
                            {t.term_en}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[t.category]}`}
                        >
                          {CATEGORY_LABELS[t.category]}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {t.short_def}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-gray-300" aria-hidden="true">
                      ›
                    </span>
                  </button>
                  <div className="mx-4 border-b border-gray-50 md:mx-6" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* 용어 상세 모달 */}
      <TermModal
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
        onTermClick={handleTermClick}
      />
    </>
  )
}
