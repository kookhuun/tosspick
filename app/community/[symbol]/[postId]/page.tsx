// @TASK P4-커뮤니티 - 게시글 상세 페이지

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CommentSection from '@/components/community/CommentSection'
import { MOCK_POSTS, MOCK_COMMENTS } from '@/lib/community/mock-data'
import { formatRelativeTime } from '@/lib/community/format-time'
import type { Post, Comment } from '@/lib/community/mock-data'

const CATEGORY_LABEL: Record<string, string> = {
  general: '일반',
  question: '질문',
  bullish: '호재',
  bearish: '악재',
}
const CATEGORY_STYLE: Record<string, string> = {
  general: 'bg-gray-100 text-gray-600',
  question: 'bg-blue-50 text-blue-600',
  bullish: 'bg-green-50 text-green-600',
  bearish: 'bg-red-50 text-red-600',
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const symbol = (params.symbol as string).toUpperCase()
  const postId = params.postId as string

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [likeLoading, setLikeLoading] = useState(false)

  // TODO: 실제 세션에서 주입
  const isLoggedIn = false

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`/api/community/posts/${postId}`),
          fetch(`/api/community/posts/${postId}/comments`),
        ])

        if (!postRes.ok || !commentsRes.ok) throw new Error('API 실패')

        const postData = await postRes.json()
        const commentsData = await commentsRes.json()

        const loadedPost: Post = postData.post
        setPost(loadedPost)
        setLikeCount(loadedPost.like_count)
        setDislikeCount(loadedPost.dislike_count ?? 0)

        // 댓글을 트리 구조로 변환
        const flatComments: Comment[] = commentsData.comments ?? []
        const roots = flatComments
          .filter((c) => !c.parent_comment_id)
          .map((c) => ({
            ...c,
            replies: flatComments.filter((r) => r.parent_comment_id === c.id),
          }))
        setComments(roots)
      } catch {
        // mock 폴백
        const mockPost = MOCK_POSTS.find((p) => p.id === postId) ?? MOCK_POSTS[0]
        setPost(mockPost)
        setLikeCount(mockPost.like_count)
        setDislikeCount(mockPost.dislike_count)
        setComments(MOCK_COMMENTS)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [postId])

  async function handleReaction(type: 'like' | 'dislike') {
    if (!isLoggedIn) { router.push('/auth'); return }
    if (likeLoading) return
    setLikeLoading(true)
    try {
      const endpoint =
        type === 'like'
          ? `/api/community/posts/${postId}/like`
          : `/api/community/posts/${postId}/dislike`
      const res = await fetch(endpoint, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (type === 'like') setLikeCount(data.like_count)
        else setDislikeCount(data.dislike_count)
      }
    } catch {
      // mock 토글
      if (type === 'like') setLikeCount((p) => p + 1)
      else setDislikeCount((p) => p + 1)
    } finally {
      setLikeLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-sm text-gray-400">불러오는 중...</span>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-sm text-gray-400">게시글을 찾을 수 없습니다.</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
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
      </header>

      <div className="px-3 pt-3 flex flex-col gap-3">
        {/* 게시글 본문 */}
        <article className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
          {/* 카테고리 + 작성자 */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_STYLE[post.category] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {CATEGORY_LABEL[post.category] ?? post.category}
            </span>
            <span className="text-xs text-gray-400">
              {post.author.nickname} · {formatRelativeTime(post.created_at)}
            </span>
          </div>

          {/* 제목 */}
          <h2 className="text-base font-bold text-gray-900 mb-3">{post.title}</h2>

          {/* 본문 */}
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

          {/* 구분선 */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
            <button
              onClick={() => handleReaction('like')}
              disabled={likeLoading}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
              aria-label="좋아요"
            >
              <span className="text-base">👍</span>
              <span>{likeCount}</span>
            </button>
            <button
              onClick={() => handleReaction('dislike')}
              disabled={likeLoading}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
              aria-label="싫어요"
            >
              <span className="text-base">👎</span>
              <span>{dislikeCount}</span>
            </button>
          </div>
        </article>

        {/* 댓글 섹션 */}
        <CommentSection
          postId={postId}
          initialComments={comments}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  )
}
