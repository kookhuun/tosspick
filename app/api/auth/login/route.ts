import { NextResponse } from 'next/server'
import { signIn } from '@/lib/auth'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 })
  }

  const { user, error } = await signIn(email, password)

  if (error) {
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }

  return NextResponse.json({ user })
}
