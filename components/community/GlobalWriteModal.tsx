// @TASK P4-커뮤니티 - 전체 커뮤니티 글쓰기 모달 (종목 선택 포함)

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PostCategory } from '@/lib/community/mock-data'

const CATEGORIES: { id: PostCategory; label: string; style: string; activeStyle: string }[] = [
  { id: 'general', label: '일반', style: 'border-gray-200 text-gray-500', activeStyle: 'border-gray-500 bg-gray-100 text-gray-700 font-semibold' },
  { id: 'question', label: '질문', style: 'border-blue-200 text-blue-400', activeStyle: 'border-blue-500 bg-blue-50 text-blue-600 font-semibold' },
  { id: 'bullish', label: '호재', style: 'border-green-200 text-green-400', activeStyle: 'border-green-500 bg-green-50 text-green-600 font-semibold' },
  { id: 'bearish', label: '악재', style: 'border-red-200 text-red-400', activeStyle: 'border-red-500 bg-red-50 text-red-600 font-semibold' },
]

interface GlobalWriteModalProps {
  isLoggedIn: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function GlobalWriteModal({ isLoggedIn, onClose, onSuccess }: GlobalWriteModalProps) {
  const router = useRouter()
  const [symbol, setSymbol] = useState('')
  const [category, setCategory] = useState<PostCategory>('general')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isLoggedIn) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg bg-white rounded-t-2xl p-6 pb-10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-center text-sm text-gray-700 mb-4">
            글을 작성하려면 로그인이 필요합니다.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold"
          >
            로그인하기
          </button>
        </div>
      </div>
    )
  }

  async function handleSubmit() {
    setError('')
    const sym = symbol.trim().toUpperCase()
    if (!sym) { setError('종목 코드를 입력해주세요.'); return }
    if (!title.trim()) { setError('제목을 입력해주세요.'); return }
    if (content.trim().length < 10) { setError('내용을 10자 이상 입력해주세요.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker_id: sym,
          title: title.trim(),
          content: content.trim(),
          category,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? '게시글 작성에 실패했습니다.')
        return
      }
      onSuccess()
      onClose()
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-2xl p-5 pb-10 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-write-modal-title"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 id="global-write-modal-title" className="text-base font-bold text-gray-900">
            글 작성
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 종목 코드 입력 */}
        <div>
          <label htmlFor="symbol-input" className="block text-xs font-medium text-gray-600 mb-1">
            종목 코드
          </label>
          <input
            id="symbol-input"
            type="text"
            placeholder="예: NVDA, 005930"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            maxLength={20}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 카테고리 */}
        <div className="flex gap-2" role="group" aria-label="카테고리 선택">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              aria-pressed={category === cat.id}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                category === cat.id ? cat.activeStyle : cat.style
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 제목 */}
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="제목"
        />

        {/* 내용 */}
        <textarea
          placeholder="내용을 입력하세요 (최소 10자)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="내용"
        />

        {/* 에러 */}
        {error && (
          <p className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}

        {/* 등록 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 transition-opacity"
        >
          {submitting ? '등록 중...' : '등록'}
        </button>
      </div>
    </div>
  )
}
