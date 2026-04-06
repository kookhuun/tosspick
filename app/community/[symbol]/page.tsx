// @TASK P4-커뮤니티 - 종목별 커뮤니티 목록 페이지

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PostCard from '@/components/community/PostCard'
import WriteModal from '@/components/community/WriteModal'
import { MOCK_POSTS } from '@/lib/community/mock-data'
import type { Post } from '@/lib/community/mock-data'

type SortType = 'latest' | 'popular'

export default function CommunityListPage() {
  const params = useParams()
  const router = useRouter()
  const symbol = (params.symbol as string).toUpperCase()

  const [posts, setPosts] = useState<Post[]>([])
  const [sort, setSort] = useState<SortType>('latest')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  // TODO: 실제 세션에서 주입
  const isLoggedIn = false

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/community/posts?ticker_id=${symbol}&sort=${sort}`)
      if (!res.ok) throw new Error('API 실패')
      const data = await res.json()
      setPosts(data.posts ?? [])
    } catch {
      // mock 폴백
      const filtered = MOCK_POSTS.filter((p) => p.ticker_id === symbol || true)
      const sorted =
        sort === 'popular'
          ? [...filtered].sort((a, b) => b.like_count - a.like_count)
          : [...filtered].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
      setPosts(sorted)
    } finally {
      setLoading(false)
    }
  }, [symbol, sort])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 mr-1"
            aria-label="뒤로가기"
          >
            ←
          </button>
          <h1 className="text-base font-bold text-gray-900">{symbol} 커뮤니티</h1>
        </div>

        {/* 정렬 탭 */}
        <div className="flex px-4 pb-0 border-b border-gray-100">
          {(['latest', 'popular'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`relative py-2.5 px-4 text-sm font-medium transition-colors ${
                sort === s ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {s === 'latest' ? '최신순' : '인기순'}
              {sort === s && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* 게시글 목록 */}
      <section className="px-3 pt-3 flex flex-col gap-2">
        {loading && (
          <div className="flex justify-center py-10">
            <span className="text-sm text-gray-400">불러오는 중...</span>
          </div>
        )}
        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400">
            <p>아직 게시글이 없습니다.</p>
            <p className="mt-1">첫 글을 작성해보세요!</p>
          </div>
        )}
        {!loading &&
          posts.map((post) => (
            <PostCard key={post.id} post={post} symbol={symbol} />
          ))}
      </section>

      {/* FAB 글쓰기 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        aria-label="글쓰기"
      >
        ✏️
      </button>

      {/* 글쓰기 모달 */}
      {showModal && (
        <WriteModal
          symbol={symbol}
          isLoggedIn={isLoggedIn}
          onClose={() => setShowModal(false)}
          onSuccess={fetchPosts}
        />
      )}
    </div>
  )
}
