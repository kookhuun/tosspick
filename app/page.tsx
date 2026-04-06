// @TASK P2-S1-T1 - S1 홈 화면
// 뉴스: unstable_cache (30분) → 사용자 접속 시 캐시 유효하면 즉시 응답
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import NewsCardList from '@/components/news/NewsCardList'
import LoginNudgeBanner from '@/components/home/LoginNudgeBanner'
import { getNewsItems } from '@/lib/data/news'
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

  return (
    <main className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <LoginNudgeBanner isAuthenticated={!!user} />
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-3">오늘의 뉴스</h2>
        {/* Suspense: 캐시 미스 시 로딩 표시, 히트 시 즉시 렌더 */}
        <Suspense fallback={<p className="text-sm text-gray-400 py-4 text-center">뉴스 불러오는 중...</p>}>
          <NewsFeed />
        </Suspense>
      </section>
    </main>
  )
}
