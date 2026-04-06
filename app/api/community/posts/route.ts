// @TASK P4-R1 - 커뮤니티 게시글 목록 조회 및 작성 API
// @SPEC docs/planning - 커뮤니티 기능

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

const PAGE_SIZE = 20
const VALID_CATEGORIES = ['general', 'question', 'bullish', 'bearish'] as const
type Category = (typeof VALID_CATEGORIES)[number]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tickerId = searchParams.get('ticker_id')
  const sort = searchParams.get('sort') || 'latest'
  const page = Math.max(1, Number(searchParams.get('page')) || 1)

  if (sort !== 'latest' && sort !== 'popular') {
    return NextResponse.json({ error: 'sort는 latest 또는 popular만 가능합니다.' }, { status: 400 })
  }

  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('community_posts')
    .select('id, title, content, category, like_count, comment_count, created_at, user_id', { count: 'exact' })

  if (tickerId) {
    query = query.eq('ticker_id', tickerId)
  }

  if (sort === 'popular') {
    query = query.order('like_count', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: posts, count, error } = await query.range(from, to)

  if (error) {
    return NextResponse.json({ error: '게시글 목록을 불러올 수 없습니다.' }, { status: 500 })
  }

  // 작성자 닉네임 조회
  const userIds = [...new Set((posts ?? []).map((p) => p.user_id))]
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

  const total = count ?? 0
  const formattedPosts = (posts ?? []).map(({ user_id, content, ...rest }) => ({
    ...rest,
    content: content?.slice(0, 100) ?? '',
    author: { nickname: profileMap[user_id] ?? '알 수 없음' },
  }))

  return NextResponse.json({
    posts: formattedPosts,
    total,
    page,
    hasMore: from + PAGE_SIZE < total,
  })
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  let body: { ticker_id?: string; title?: string; content?: string; category?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
  }

  const { ticker_id, title, content, category } = body

  if (!ticker_id || !title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'ticker_id, title, content는 필수입니다.' }, { status: 400 })
  }

  if (category && !VALID_CATEGORIES.includes(category as Category)) {
    return NextResponse.json({ error: 'category는 general, question, bullish, bearish 중 하나여야 합니다.' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('community_posts')
    .insert({
      ticker_id,
      title: title.trim(),
      content: content.trim(),
      category: category || 'general',
      user_id: user.id,
      like_count: 0,
      comment_count: 0,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: '게시글 작성에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ post }, { status: 201 })
}
