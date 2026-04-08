'use client'

import { useRouter } from 'next/navigation'
import { GlossaryTerm } from '@/lib/learn/glossary-data'

interface TermModalProps {
  term: GlossaryTerm | null
  onClose: () => void
}

export default function TermModal({ term, onClose }: TermModalProps) {
  const router = useRouter()
  if (!term) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm transition-all duration-300">
      <div 
        className="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh] no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-6">
          {/* 헤더 */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full w-fit uppercase tracking-widest">{term.category}</span>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">{term.term}</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors shadow-sm"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* 기본 뜻 */}
            <section className="bg-gray-50 p-6 rounded-[28px]">
              <h3 className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">📚</span>
                이게 뭔가요?
              </h3>
              <p className="text-sm text-gray-800 leading-relaxed font-semibold">
                {term.full_explanation}
              </p>
            </section>

            {/* 실전 활용법 */}
            <section className="bg-blue-50 p-6 rounded-[28px] border border-blue-100/50">
              <h3 className="text-xs font-bold text-blue-600 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">🎯</span>
                실전: 언제 사용하나요?
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed font-black">
                {term.usage}
              </p>
            </section>

            {/* 초보자 실수 */}
            <section className="bg-orange-50 p-6 rounded-[28px] border border-orange-100/50">
              <h3 className="text-xs font-bold text-orange-600 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">⚠️</span>
                주의: 초보자 실수
              </h3>
              <p className="text-sm text-orange-800 leading-relaxed font-black">
                {term.mistake}
              </p>
            </section>
          </div>

          {/* 행동 유도 버튼 */}
          <div className="flex flex-col gap-3 mt-4">
            <button 
              onClick={() => {
                onClose()
                router.push(term.actionLink)
              }}
              className="w-full py-5 bg-blue-600 text-white rounded-[24px] text-sm font-black hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
            >
              {term.actionText}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors"
            >
              다음에 할게요
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
