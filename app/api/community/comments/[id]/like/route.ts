// @TASK P4-R1 - 댓글 좋아요 토글 API

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: commentId } = await params
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const supabase = await createClient()

  // 댓글 존재 확인
  const { data: comment, error: commentError } = await supabase
    .from('community_comments')
    .select('id, like_count')
    .eq('id', commentId)
    .single()

  if (commentError || !comment) {
    return NextResponse.json({ error: '댓글을 찾을 수 없습니다.' }, { status: 404 })
  }

  // 기존 좋아요 확인
  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('comment_id', commentId)
    .maybeSingle()

  let liked: boolean
  let newCount: number

  if (existing) {
    // 좋아요 취소
    await supabase
      .from('comment_likes')
      .delete()
      .eq('id', existing.id)

    newCount = Math.max(0, comment.like_count - 1)
    liked = false
  } else {
    // 좋아요 추가
    const { error: insertError } = await supabase
      .from('comment_likes')
      .insert({ user_id: user.id, comment_id: commentId })

    if (insertError) {
      return NextResponse.json({ error: '좋아요 처리에 실패했습니다.' }, { status: 500 })
    }

    newCount = comment.like_count + 1
    liked = true
  }

  // like_count 동기 업데이트
  await supabase
    .from('community_comments')
    .update({ like_count: newCount })
    .eq('id', commentId)

  return NextResponse.json({ liked, like_count: newCount })
}
