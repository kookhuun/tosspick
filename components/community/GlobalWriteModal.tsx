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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-6 text-center">
            <div className="flex flex-col gap-2">
              <span className="text-3xl">✏️</span>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">투자 의견을 남겨보세요</h2>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                로그인하면 종목에 대한 생각과<br />
                분석 내용을 기록할 수 있어요.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/auth')}
                className="w-full py-4 rounded-2xl bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                로그인하고 시작하기
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors"
              >
                나중에 하기
              </button>
            </div>
          </div>
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-[32px] p-6 pb-12 flex flex-col gap-5 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-write-modal-title"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 id="global-write-modal-title" className="text-lg font-extrabold text-gray-900 tracking-tight">
            의견 나누기
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div>
          <label htmlFor="symbol-input" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
            종목 코드
          </label>
          <input
            id="symbol-input"
            type="text"
            placeholder="예: NVDA, 005930"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            maxLength={20}
            className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
          />
        </div>

        <div className="flex gap-2" role="group" aria-label="카테고리 선택">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-1 py-2.5 text-xs rounded-xl border transition-all ${
                category === cat.id ? cat.activeStyle : cat.style
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="제목을 적어주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
        />

        <textarea
          placeholder="내용을 10자 이상 입력해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full border border-gray-100 bg-gray-50 rounded-2xl px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium leading-relaxed"
        />

        {error && (
          <p className="text-xs text-red-500 font-bold px-1" role="alert">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-blue-600 text-white text-sm font-black shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95"
        >
          {submitting ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </div>
  )
}
