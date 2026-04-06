// @TASK P4-프로필 - 내 프로필 수정 API

import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(request: Request) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const body = await request.json() as {
    nickname?: string
    holdings_public?: boolean
    avatar_color?: string
  }

  // DB 없이 mock — 실제 저장은 클라이언트 localStorage 담당
  return NextResponse.json({ success: true, updates: body })
}
