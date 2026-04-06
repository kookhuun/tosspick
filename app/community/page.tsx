// @TASK P4-커뮤니티 - 전체 커뮤니티 메인 페이지
// Server Component — 초기 데이터 주입 후 CommunityFeed(Client)에 전달

import { createClient } from '@/lib/supabase/server'
import HotTickers from '@/components/community/HotTickers'
import CommunityFeed from '@/components/community/CommunityFeed'
import { MOCK_GLOBAL_POSTS } from '@/lib/community/mock-data'
import type { GlobalPost } from '@/lib/community/mock-data'

async function getSessionUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

async function getGlobalPosts(): Promise<GlobalPost[]> {
  // DB 연결 시 Supabase 쿼리로 교체:
  // const supabase = await createClient()
  // const { data } = await supabase
  //   .from('posts')
  //   .select('*, tickers(symbol, name)')
  //   .order('created_at', { ascending: false })
  //   .limit(50)
  // return data ?? []
  return MOCK_GLOBAL_POSTS
}

export default async function CommunityPage() {
  const [user, posts] = await Promise.all([
    getSessionUser(),
    getGlobalPosts(),
  ])

  // DB 연결 시 실제 집계 데이터로 교체
  const hotTickers: [] = []

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="text-base font-bold text-gray-900">커뮤니티</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* 핫 종목 섹션 */}
        <HotTickers tickers={hotTickers} />

        {/* 피드 (필터/정렬/목록 — Client) */}
        <CommunityFeed initialPosts={posts} isLoggedIn={!!user} />
      </div>
    </div>
  )
}
