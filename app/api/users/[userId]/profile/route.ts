// @TASK P4-프로필 - 유저 프로필 조회 API

import { NextResponse } from 'next/server'
import { MOCK_PROFILES } from '@/lib/profile/mock-data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  const profile = MOCK_PROFILES[userId]

  if (!profile) {
    return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
  }

  return NextResponse.json({ profile })
}
