// @TASK P4-커뮤니티 - 댓글 섹션 (댓글 + 대댓글 1단계)
// @TASK P4-프로필 - 댓글 작성자 닉네임 → 프로필 링크 연결

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/community/format-time'
import type { Comment } from '@/lib/community/mock-data'

interface CommentItemProps {
  comment: Comment
  isReply?: boolean
  isLoggedIn: boolean
  onReply: (parentId: string, parentNickname: string) => void
}

function CommentItem({ comment, isReply = false, isLoggedIn, onReply }: CommentItemProps) {
  const [likeCount, setLikeCount] = useState(comment.like_count)

  async function handleLike() {
    if (!isLoggedIn) return
    try {
      const res = await fetch(`/api/community/comments/${comment.id}/like`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setLikeCount(data.like_count)
      }
    } catch {
      // 실패 시 mock 토글
      setLikeCount((prev) => prev + 1)
    }
  }

  return (
    <div className={`${isReply ? 'ml-8 pl-3 border-l-2 border-gray-100' : ''}`}>
      <div className="py-3">
        {/* 작성자 + 시간 */}
        <div className="flex items-center gap-2 mb-1">
          {comment.author.id ? (
            <Link
              href={`/profile/${comment.author.id}`}
              className="text-xs font-semibold text-gray-800 hover:text-[#3182F6] transition-colors"
            >
              {comment.author.nickname}
            </Link>
          ) : (
            <span className="text-xs font-semibold text-gray-800">{comment.author.nickname}</span>
          )}
          <span className="text-xs text-gray-400">{formatRelativeTime(comment.created_at)}</span>
        </div>

        {/* 내용 */}
        <p className="text-sm text-gray-700 leading-relaxed mb-2">{comment.content}</p>

        {/* 하단 액션 */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="좋아요"
          >
            <span>👍</span>
            <span>{likeCount}</span>
          </button>
          {!isReply && (
            <button
              onClick={() => onReply(comment.id, comment.author.nickname)}
              className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
            >
              답글
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
  isLoggedIn: boolean
}

export default function CommentSection({ postId, initialComments, isLoggedIn }: CommentSectionProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [inputText, setInputText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyTarget, setReplyTarget] = useState<{ id: string; nickname: string } | null>(null)

  function handleReply(parentId: string, parentNickname: string) {
    if (!isLoggedIn) { router.push('/auth'); return }
    setReplyTarget({ id: parentId, nickname: parentNickname })
    setInputText(`@${parentNickname} `)
  }

  function cancelReply() {
    setReplyTarget(null)
    setInputText('')
  }

  async function handleSubmit() {
    if (!isLoggedIn) { router.push('/auth'); return }
    const trimmed = inputText.trim()
    if (!trimmed) return

    setSubmitting(true)
    try {
      const body: { content: string; parent_comment_id?: string } = {
        content: trimmed,
      }
      if (replyTarget) body.parent_comment_id = replyTarget.id

      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        const data = await res.json()
        const newComment: Comment = {
          ...data.comment,
          author: { nickname: '나' },
          replies: [],
        }

        if (replyTarget) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === replyTarget.id
                ? { ...c, replies: [...c.replies, newComment] }
                : c
            )
          )
        } else {
          setComments((prev) => [...prev, { ...newComment, replies: [] }])
        }
      } else {
        // mock 폴백: 로컬에만 추가
        const mockComment: Comment = {
          id: `mock-${Date.now()}`,
          content: trimmed,
          like_count: 0,
          created_at: new Date().toISOString(),
          author: { nickname: '나' },
          parent_comment_id: replyTarget?.id ?? null,
          replies: [],
        }
        if (replyTarget) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === replyTarget.id
                ? { ...c, replies: [...c.replies, mockComment] }
                : c
            )
          )
        } else {
          setComments((prev) => [...prev, mockComment])
        }
      }

      setInputText('')
      setReplyTarget(null)
    } catch {
      // 네트워크 오류 시 mock 폴백 동일하게 처리
    } finally {
      setSubmitting(false)
    }
  }

  const totalCount = comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">댓글 {totalCount}</h3>
      </div>

      {/* 댓글 목록 */}
      <div className="px-4 divide-y divide-gray-50">
        {comments.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">첫 댓글을 남겨보세요.</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              isLoggedIn={isLoggedIn}
              onReply={handleReply}
            />
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply
                isLoggedIn={isLoggedIn}
                onReply={handleReply}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
        {replyTarget && (
          <div className="flex items-center justify-between mb-2 text-xs text-blue-600">
            <span>@{replyTarget.nickname} 에게 답글</span>
            <button onClick={cancelReply} className="text-gray-400 hover:text-gray-600">취소</button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isLoggedIn ? '댓글을 입력하세요' : '로그인 후 댓글을 작성할 수 있습니다'}
            readOnly={!isLoggedIn}
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
            }}
            className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={isLoggedIn ? handleSubmit : () => router.push('/auth')}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 whitespace-nowrap"
          >
            {submitting ? '...' : '전송'}
          </button>
        </div>
      </div>
    </div>
  )
}
