// @TASK P4-R1 - 댓글 목록 조회 및 작성 API

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params
  const supabase = await createClient()

  const { data: comments, error } = await supabase
    .from('community_comments')
    .select('id, content, like_count, created_at, user_id, parent_comment_id')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: '댓글을 불러올 수 없습니다.' }, { status: 500 })
  }

  // 작성자 닉네임 조회
  const userIds = [...new Set((comments ?? []).map((c) => c.user_id))]
  let profileMap: Record<string, string> = {}

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, nickname')
      .in('id', userIds)

    if (profiles) {
      profileMap = Object.fromEntries(profiles.map((p) => [p.id, p.nickname]))
    }
  }

  const formattedComments = (comments ?? []).map(({ user_id, ...rest }) => ({
    ...rest,
    author: { nickname: profileMap[user_id] ?? '알 수 없음' },
  }))

  return NextResponse.json({ comments: formattedComments })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  let body: { content?: string; parent_comment_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
  }

  const { content, parent_comment_id } = body

  if (!content?.trim()) {
    return NextResponse.json({ error: '댓글 내용을 입력해주세요.' }, { status: 400 })
  }

  const supabase = await createClient()

  // 게시글 존재 확인
  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select('id, comment_count')
    .eq('id', postId)
    .single()

  if (postError || !post) {
    return NextResponse.json({ error: '게시글을 찾을 수 없습니다.' }, { status: 404 })
  }

  // 대댓글인 경우 1단계만 허용
  if (parent_comment_id) {
    const { data: parentComment, error: parentError } = await supabase
      .from('community_comments')
      .select('id, parent_comment_id')
      .eq('id', parent_comment_id)
      .single()

    if (parentError || !parentComment) {
      return NextResponse.json({ error: '부모 댓글을 찾을 수 없습니다.' }, { status: 400 })
    }

    if (parentComment.parent_comment_id !== null) {
      return NextResponse.json({ error: '대댓글에는 답글을 달 수 없습니다. (1단계만 허용)' }, { status: 400 })
    }
  }

  const { data: comment, error: insertError } = await supabase
    .from('community_comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content: content.trim(),
      parent_comment_id: parent_comment_id || null,
      like_count: 0,
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: '댓글 작성에 실패했습니다.' }, { status: 500 })
  }

  // comment_count +1
  await supabase
    .from('community_posts')
    .update({ comment_count: post.comment_count + 1 })
    .eq('id', postId)

  return NextResponse.json({ comment }, { status: 201 })
}
