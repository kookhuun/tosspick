// S1 홈 화면 — 오늘의 뉴스 | 오늘의 주식현황 | 내 종목
// 갱신: after()로 응답 후 백그라운드에서 RSS+Gemini 자동 수집 (30분 간격)
import { after } from 'next/server'
import { Suspense } from 'react'
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
    if (!user) return { user: null, watchlist: [] }

    // 관심주 조회
    const { data: watchlist } = await supabase
      .from('watchlist_items')
      .select('tickers(id, symbol, name, current_price, price_change_rate)')
      .eq('user_id', user.id)
      .limit(10)

    const tickers = (watchlist ?? [])
      .map((w) => w.tickers)
      .filter(Boolean)
      .flat() as { symbol: string; name: string; current_price: number; price_change_rate: number }[]

    return { user, watchlist: tickers }
  } catch {
    return { user: null, watchlist: [] }
  }
}

export default async function HomePage() {
  const [{ user, watchlist }, news, movers] = await Promise.all([
    getSessionData(),
    getNewsItems(12),
    getBiggestMovers(20),
  ])

  // 응답 후 백그라운드에서 뉴스 갱신 (Gemini API key 있을 때만)
  if (process.env.GEMINI_API_KEY) {
    after(async () => {
      try { await collectAndSaveNews() } catch { /* 실패해도 사용자에게 영향 없음 */ }
    })
  }

  const today = new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })

  return (
    <main className="flex flex-col gap-8 p-0 max-w-2xl mx-auto pb-24 bg-gray-50/50 min-h-screen">
      
      {/* ⓪ 환영 헤더 */}
      <header className="px-5 pt-8 pb-2 flex flex-col gap-1 bg-white border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400">{today}</p>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          {user ? `${user.user_metadata?.name || '사용자'}님, 안녕하세요` : '반가워요! 주식 정보를 확인해 보세요'}
        </h1>
      </header>

      {/* ① 오늘의 뉴스 - 가로 스크롤 UX 강조 */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">오늘의 뉴스</h2>
          <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">더보기</span>
        </div>
        <Suspense fallback={<p className="text-sm text-gray-400 py-4 text-center">뉴스를 분석하는 중...</p>}>
          <NewsCardList items={news as NewsItem[]} />
        </Suspense>
      </section>

      {/* ② 오늘의 주식현황 - 카드형 리스트 */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">오늘의 주식현황</h2>
          <span className="text-xs text-gray-400 font-medium">실시간 급변동</span>
        </div>
        <StockMarketStatus movers={movers} />
      </section>

      {/* ③ 내가 투자한 종목 - 맞춤형 정보 */}
      <section className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">내 종목</h2>
          {user && <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">편집</span>}
        </div>
        <MyPortfolio isLoggedIn={!!user} tickers={watchlist} />
      </section>

    </main>
  )
}
