// @TASK P2-S1-T1 - S1 홈 화면
import { createClient } from '@/lib/supabase/server'
import NewsCardList from '@/components/news/NewsCardList'
import LoginNudgeBanner from '@/components/home/LoginNudgeBanner'
import type { NewsItem } from '@/components/news/NewsCard'

async function getNews(limit = 5): Promise<NewsItem[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('news_items')
      .select('id, title, summary_one_line, impact_direction, related_tickers, source_url, published_at')
      .order('published_at', { ascending: false })
      .limit(limit)
    return (data as NewsItem[]) ?? []
  } catch {
    return []
  }
}

async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [news, user] = await Promise.all([getNews(), getUser()])

  return (
    <main className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <LoginNudgeBanner isAuthenticated={!!user} />
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-3">오늘의 뉴스</h2>
        <NewsCardList items={news} />
      </section>
    </main>
  )
}
