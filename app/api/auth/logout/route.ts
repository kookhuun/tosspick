import { NextResponse } from 'next/server'
import { signOut } from '@/lib/auth'

export async function POST() {
  const { error } = await signOut()

  if (error) {
    return NextResponse.json({ error: '로그아웃 중 오류가 발생했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
