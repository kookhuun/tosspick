// @TASK P4-R1 - 게시글 좋아요 토글 API

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
    .select('id, like_count')
    .eq('id', postId)
    .single()

  if (postError || !post) {
    return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
  }

  // 기존 좋아요 확인
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .maybeSingle()

  let liked: boolean
  let newCount: number

  if (existing) {
    // 좋아요 취소
    await supabase
      .from('post_likes')
      .delete()
      .eq('id', existing.id)

    newCount = Math.max(0, post.like_count - 1)
    liked = false
  } else {
    // 좋아요 추가
    const { error: insertError } = await supabase
      .from('post_likes')
      .insert({ user_id: user.id, post_id: postId })

    if (insertError) {
      return NextResponse.json({ error: '좋아요 처리에 실패했습니다.' }, { status: 500 })
    }

    newCount = post.like_count + 1
    liked = true
  }

  // like_count 동기 업데이트
  await supabase
    .from('community_posts')
    .update({ like_count: newCount })
    .eq('id', postId)

  return NextResponse.json({ liked, like_count: newCount })
}
