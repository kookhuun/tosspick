// @TASK P4-R1 - 커뮤니티 게시글 상세 조회 및 삭제 API

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('community_posts')
    .select('id, title, content, category, like_count, comment_count, created_at, user_id, ticker_id')
    .eq('id', id)
    .single()

  if (error || !post) {
    return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
  }

  // 작성자 닉네임 조회
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('nickname')
    .eq('id', post.user_id)
    .single()

  const { user_id, ...rest } = post

  return NextResponse.json({
    post: {
      ...rest,
      author: { nickname: profile?.nickname ?? '알 수 없음' },
    },
  })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const supabase = await createClient()

  // 게시글 존재 및 소유권 확인
  const { data: post, error: fetchError } = await supabase
    .from('community_posts')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (fetchError || !post) {
    return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
  }

  if (post.user_id !== user.id) {
    return NextResponse.json({ error: '본인의 게시글만 삭제할 수 있습니다.' }, { status: 403 })
  }

  const { error: deleteError } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: '게시글 삭제에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ message: '게시글이 삭제되었습니다.' })
}
