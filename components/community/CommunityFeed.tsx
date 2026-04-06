// @TASK P4-커뮤니티 - 전체 커뮤니티 피드 (필터/정렬/목록)
// Client Component — 카테고리 필터, 정렬, FAB 글쓰기 담당

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/community/format-time'
import GlobalWriteModal from '@/components/community/GlobalWriteModal'
import type { GlobalPost, PostCategory } from '@/lib/community/mock-data'

type SortType = 'latest' | 'popular'
type FilterType = 'all' | PostCategory

const FILTER_TABS: { id: FilterType; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'bullish', label: '호재' },
  { id: 'bearish', label: '악재' },
  { id: 'question', label: '질문' },
  { id: 'general', label: '일반' },
]

const CATEGORY_LABEL: Record<PostCategory, string> = {
  general: '일반',
  question: '질문',
  bullish: '호재',
  bearish: '악재',
}

const CATEGORY_STYLE: Record<PostCategory, string> = {
  general: 'bg-gray-100 text-gray-600',
  question: 'bg-blue-50 text-blue-600',
  bullish: 'bg-green-50 text-green-600',
  bearish: 'bg-red-50 text-red-600',
}

interface CommunityFeedProps {
  initialPosts: GlobalPost[]
  isLoggedIn: boolean
}

export default function CommunityFeed({ initialPosts, isLoggedIn }: CommunityFeedProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('latest')
  const [showModal, setShowModal] = useState(false)
  // DB 연결 시 API fetch로 교체할 수 있도록 posts 상태로 관리
  const [posts] = useState<GlobalPost[]>(initialPosts)

  const filtered = useMemo(() => {
    const base = filter === 'all' ? posts : posts.filter((p) => p.category === filter)
    return sort === 'popular'
      ? [...base].sort((a, b) => b.like_count - a.like_count)
      : [...base].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [posts, filter, sort])

  return (
    <>
      {/* 카테고리 필터 탭 + 정렬 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        {/* 카테고리 탭 */}
        <div
          className="flex overflow-x-auto scrollbar-hide px-4 pt-2"
          role="tablist"
          aria-label="카테고리 필터"
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`relative flex-shrink-0 py-2.5 px-4 text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              {filter === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* 정렬 버튼 */}
        <div className="flex justify-end gap-1 px-4 py-2">
          {(['latest', 'popular'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              aria-pressed={sort === s}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sort === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {s === 'latest' ? '최신순' : '인기순'}
            </button>
          ))}
        </div>
      </div>

      {/* 게시글 목록 */}
      <section aria-label="게시글 목록">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400">
            <p>아직 게시글이 없습니다.</p>
            <p className="mt-1">첫 글을 작성해보세요!</p>
          </div>
        ) : (
          <ul>
            {filtered.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/community/${post.ticker_id}/${post.id}`}
                  className="block bg-white border-b border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* 상단: 배지 + 종목명 + 시간 + 작성자 */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_STYLE[post.category]}`}
                      >
                        {CATEGORY_LABEL[post.category]}
                      </span>
                      <span className="text-xs font-semibold text-gray-700 truncate">
                        {post.ticker_name}
                      </span>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 ml-2">
                      <span>{formatRelativeTime(post.created_at)}</span>
                      <span>·</span>
                      <span>{post.author.nickname}</span>
                    </div>
                  </div>

                  {/* 제목 */}
                  <p className="text-sm font-medium text-gray-900 line-clamp-1 mb-1.5">
                    {post.title}
                  </p>

                  {/* 하단: 반응 수 */}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span aria-label={`좋아요 ${post.like_count}개`}>
                      <span aria-hidden="true">👍</span> {post.like_count}
                    </span>
                    <span aria-label={`댓글 ${post.comment_count}개`}>
                      <span aria-hidden="true">💬</span> {post.comment_count}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* FAB 글쓰기 버튼 */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 h-12 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
        aria-label="글쓰기"
      >
        <span aria-hidden="true">✏️</span>
        <span>글쓰기</span>
      </button>

      {/* 글쓰기 모달 */}
      {showModal && (
        <GlobalWriteModal
          isLoggedIn={isLoggedIn}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            // DB 연결 시 여기서 목록 갱신
          }}
        />
      )}
    </>
  )
}
