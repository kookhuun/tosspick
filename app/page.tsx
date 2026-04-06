// @TASK P2-S1-T1 - S1 홈 화면
// 갱신 전략:
//   1. getNewsItems() → unstable_cache (30분) 로 즉시 응답
//   2. after() → 응답 후 백그라운드에서 RSS 수집 + Claude 요약 + DB 저장
//      단, 30분 이내에 이미 수집된 경우 건너뜀 (불필요한 API 비용 방지)
import { after } from 'next/server'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import NewsCardList from '@/components/news/NewsCardList'
import LoginNudgeBanner from '@/components/home/LoginNudgeBanner'
import { getNewsItems } from '@/lib/data/news'
import { collectAndSaveNews } from '@/lib/refresh/news'
import type { NewsItem } from '@/components/news/NewsCard'

async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

async function NewsFeed() {
  const items = await getNewsItems(10)
  return <NewsCardList items={items as NewsItem[]} />
}

export default async function HomePage() {
  const user = await getUser()

  // 응답을 보낸 뒤 백그라운드에서 뉴스 갱신 시도
  // 30분 이내 수집된 경우 자동으로 건너뜀 → Claude API 비용 절약
  after(async () => {
    try {
      await collectAndSaveNews()
    } catch {
      // 갱신 실패해도 사용자에게 영향 없음
    }
  })

  return (
    <main className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <LoginNudgeBanner isAuthenticated={!!user} />
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-3">오늘의 뉴스</h2>
        <Suspense fallback={<p className="text-sm text-gray-400 py-4 text-center">뉴스 불러오는 중...</p>}>
          <NewsFeed />
        </Suspense>
      </section>
    </main>
  )
}
