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

  // 응답 후 백그라운드에서 뉴스 갱신 (30분 간격, Gemini 무료 티어)
  after(async () => {
    try { await collectAndSaveNews() } catch { /* 실패해도 사용자에게 영향 없음 */ }
  })

  return (
    <main className="flex flex-col gap-6 p-4 max-w-2xl mx-auto pb-24">

      {/* ① 오늘의 뉴스 */}
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-3">오늘의 뉴스</h2>
        <Suspense fallback={<p className="text-sm text-gray-400 py-4 text-center">뉴스 불러오는 중...</p>}>
          <NewsCardList items={news as NewsItem[]} />
        </Suspense>
      </section>

      {/* ② 오늘의 주식현황 — 변동 큰 순서 */}
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-3">오늘의 주식현황</h2>
        <StockMarketStatus movers={movers} />
      </section>

      {/* ③ 내가 투자한 종목 */}
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-3">내 종목</h2>
        <MyPortfolio isLoggedIn={!!user} tickers={watchlist} />
      </section>

    </main>
  )
}
