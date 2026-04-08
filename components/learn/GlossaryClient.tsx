'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GLOSSARY_DATA, GlossaryTerm } from '@/lib/learn/glossary-data'
import TermModal from './TermModal'

export default function GlossaryClient() {
  const router = useRouter()
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'basic', label: '기초지식' },
    { id: 'indicator', label: '투자지표' },
    { id: 'chart', label: '차트공부' },
  ]

  const filteredData = activeCategory === 'all' 
    ? GLOSSARY_DATA 
    : GLOSSARY_DATA.filter(item => item.category === activeCategory)

  return (
    <div className="flex flex-col gap-8">
      
      {/* 훈련 시스템 연결 배너 (고급화) */}
      <div 
        onClick={() => router.push('/trading')}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white shadow-2xl shadow-blue-100 cursor-pointer group active:scale-[0.98] transition-all"
      >
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest opacity-90">Learning by Doing</span>
            <h3 className="text-2xl font-black tracking-tight leading-tight">
              지식은 이제 충분해요.<br />
              실전 훈련을 시작할까요?
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black px-6 py-3 bg-white text-blue-600 rounded-[20px] shadow-sm group-hover:bg-blue-50 transition-colors">
              투자 훈련소 입장하기 →
            </span>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-blue-400 flex items-center justify-center text-[10px] font-bold">초보</div>
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-indigo-400 flex items-center justify-center text-[10px] font-bold">중수</div>
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 bg-purple-400 flex items-center justify-center text-[10px] font-bold">고수</div>
            </div>
          </div>
        </div>
        {/* 배경 장식 */}
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-3 rounded-full text-xs font-black transition-all whitespace-nowrap ${
              activeCategory === cat.id 
                ? 'bg-gray-900 text-white shadow-xl translate-y-[-2px]' 
                : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 용어 카드 리스트 */}
      <div className="grid grid-cols-1 gap-4">
        {filteredData.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedTerm(item)}
            className="p-8 bg-white rounded-[32px] border border-gray-50 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group active:scale-[0.99] flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{item.category}</span>
                <h4 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.term}</h4>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                →
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-400 leading-relaxed line-clamp-2">
              {item.short_definition}
            </p>
          </div>
        ))}
      </div>

      <TermModal term={selectedTerm} onClose={() => setSelectedTerm(null)} />
    </div>
  )
}
