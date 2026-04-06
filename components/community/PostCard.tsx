// @TASK P4-커뮤니티 - 게시글 카드 컴포넌트 (에브리타임 스타일)

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/community/format-time'
import type { Post, PostCategory } from '@/lib/community/mock-data'

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

interface PostCardProps {
  post: Post
  symbol: string
}

export default function PostCard({ post, symbol }: PostCardProps) {
  return (
    <Link href={`/community/${symbol}/${post.id}`}>
      <article className="bg-white rounded-xl px-4 py-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        {/* 상단 메타 */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_STYLE[post.category]}`}
          >
            {CATEGORY_LABEL[post.category]}
          </span>
          <span className="text-xs text-gray-400">
            {post.author.nickname} · {formatRelativeTime(post.created_at)}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{post.title}</h3>

        {/* 내용 미리보기 */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{post.content}</p>

        {/* 하단 반응 수 */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>👍 {post.like_count}</span>
          <span>👎 {post.dislike_count}</span>
          <span>💬 {post.comment_count}</span>
        </div>
      </article>
    </Link>
  )
}
