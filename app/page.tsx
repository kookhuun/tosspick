// S1 홈 화면 — 토스식 스토리 배너 + 친근한 문어체 UI
import { after } from 'next/server'
import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NewsCardList from '@/components/news/NewsCardList'
import StockMarketStatus from '@/components/home/StockMarketStatus'
import MyPortfolio from '@/components/home/MyPortfolio'
import { getNewsItems } from '@/lib/data/news'
import { getBiggestMovers } from '@/lib/data/market'
import { collectAndSaveNews } from '@/lib/refresh/news'
import type { NewsItem } from '@/components/news/NewsCard'

async function getSessionData() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return { user: user ?? null, watchlist: [] }
  } catch { return { user: null, watchlist: [] } }
}

export default async function HomePage() {
  const [{ user }, news, movers] = await Promise.all([
    getSessionData(),
    getNewsItems(12),
    getBiggestMovers(20),
  ])

  const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })

  return (
    <main className="flex flex-col gap-6 p-4 max-w-2xl mx-auto pb-32 animate-toss-in">
      
      {/* ⓪ 상단 헤더: 친근한 문어체 + AHA MOMENT */}
      <header className="px-1 pt-6 pb-2 flex flex-col gap-1.5">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{today}</p>
        <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">
          {user ? `${user.user_metadata?.name || '사용자'}님,\n오늘 시장은 어떨까요?` : '투자가 처음인가요?\n오늘부터 시작해봐요'}
        </h1>
      </header>

      {/* ① 핵심 행동 유도: 스토리 배너 (1/1/1 법칙) */}
      <section className="flex flex-col gap-4">
        <Link 
          href="/trading"
          className="toss-card bg-blue-600 text-white toss-pressable shadow-blue-100/50"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Training Center</span>
            <h3 className="text-xl font-black tracking-tight leading-tight">
              실제 돈이 아니니까<br />
              부담 없이 시작해봐요 🎯
            </h3>
            <p className="text-xs text-blue-100/70 font-bold mt-4">무료 훈련 지원금 1,000만원 지급</p>
          </div>
        </Link>
      </section>

      {/* ② 사회적 증거 (Social Proof) 섹션 */}
      <section className="toss-card flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-bold text-gray-400">투자자들의 관심</p>
          <h4 className="text-sm font-black text-gray-800">지금 3,241명이 공부 중 🔥</h4>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
          ))}
        </div>
      </section>

      {/* ③ 오늘의 뉴스: 카드형 리스트 */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-black text-gray-900">오늘의 뉴스</h2>
          <span className="text-xs text-blue-600 font-bold toss-pressable">더보기</span>
        </div>
        <Suspense fallback={<div className="h-40 bg-white rounded-[32px] animate-pulse" />}>
          <NewsCardList items={news as NewsItem[]} />
        </Suspense>
      </section>

      {/* ④ 오늘의 주식현황: 컴팩트 카드 */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-black text-gray-900">시장의 목소리</h2>
          <span className="text-xs text-gray-400 font-bold">실시간</span>
        </div>
        <div className="toss-card p-4">
          <StockMarketStatus movers={movers} />
        </div>
      </section>

    </main>
  )
}
