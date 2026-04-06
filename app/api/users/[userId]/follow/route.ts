// @TASK P4-프로필 - 팔로우/언팔로우 API

import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { MOCK_PROFILES } from '@/lib/profile/mock-data'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { userId } = await params

  if (user.id === userId) {
    return NextResponse.json({ error: '본인을 팔로우할 수 없습니다.' }, { status: 400 })
  }

  if (!MOCK_PROFILES[userId]) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
  }

  // DB 없이 mock 토글 — 항상 following: true 반환
  return NextResponse.json({ success: true, following: true })
}
