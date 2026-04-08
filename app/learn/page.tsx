import { GLOSSARY_DATA } from '@/lib/learn/glossary-data'
import GlossaryClient from '@/components/learn/GlossaryClient'

export const metadata = {
  title: '투자 용어사전 — 투자판',
  description: `PER, PBR, 이동평균선 등 ${GLOSSARY_DATA.length}개 이상의 주식 투자 용어를 쉽게 이해하세요.`,
}

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 헤더 */}
      <div className="border-b border-gray-100 bg-white px-4 py-6 md:px-6">
        <h1 className="text-2xl font-bold text-gray-900">투자 용어사전</h1>
        <p className="mt-1 text-sm text-gray-500">
          {GLOSSARY_DATA.length}개 용어 · 처음 접하는 투자 용어도 쉽게 이해하세요
        </p>
      </div>

      {/* 클라이언트 영역 (검색·필터·리스트·모달) */}
      <GlossaryClient />
    </div>
  )
}
