import { NextResponse } from 'next/server'
import { getProfile, updateProfile } from '@/lib/user-profile'

export async function GET() {
  const { data, error } = await getProfile()
  if (!data) return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profile: data })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const updates: { nickname?: string; avatar_url?: string } = {}
  if (body.nickname) updates.nickname = body.nickname
  if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url

  const { data, error } = await updateProfile(updates)
  if (!data && !error) return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ profile: data })
}
