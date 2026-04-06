// @TASK P4-커뮤니티 - 게시글 싫어요 토글 API

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const supabase = await createClient()

  // 게시글 존재 확인
  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select('id, dislike_count')
    .eq('id', postId)
    .single()

  if (postError || !post) {
    return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
  }

  // 기존 싫어요 확인
  const { data: existing } = await supabase
    .from('post_dislikes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .maybeSingle()

  let disliked: boolean
  let newCount: number

  if (existing) {
    // 싫어요 취소
    await supabase
      .from('post_dislikes')
      .delete()
      .eq('id', existing.id)

    newCount = Math.max(0, (post.dislike_count ?? 0) - 1)
    disliked = false
  } else {
    // 싫어요 추가
    const { error: insertError } = await supabase
      .from('post_dislikes')
      .insert({ user_id: user.id, post_id: postId })

    if (insertError) {
      return NextResponse.json({ error: '싫어요 처리에 실패했습니다.' }, { status: 500 })
    }

    newCount = (post.dislike_count ?? 0) + 1
    disliked = true
  }

  // dislike_count 동기 업데이트
  await supabase
    .from('community_posts')
    .update({ dislike_count: newCount })
    .eq('id', postId)

  return NextResponse.json({ disliked, dislike_count: newCount })
}
