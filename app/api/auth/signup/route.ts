import { NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

export async function POST(request: Request) {
  const { email, password, nickname } = await request.json()

  if (!email || !password || !nickname) {
    return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: '비밀번호는 8자 이상이어야 합니다.' }, { status: 400 })
  }

  const { user, error } = await signUp(email, password, nickname)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user }, { status: 201 })
}
