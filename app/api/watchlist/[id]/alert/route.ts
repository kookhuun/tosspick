// @TASK P4-R2 - 관심주 알림 토글 API

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  let body: { alert_enabled?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
  }

  if (typeof body.alert_enabled !== 'boolean') {
    return NextResponse.json({ error: 'alert_enabled는 boolean 값이어야 합니다.' }, { status: 400 })
  }

  const supabase = await createClient()

  // 소유권 확인
  const { data: item, error: fetchError } = await supabase
    .from('watchlist_items')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (fetchError || !item) {
    return NextResponse.json({ error: '관심주를 찾을 수 없습니다.' }, { status: 404 })
  }

  if (item.user_id !== user.id) {
    return NextResponse.json({ error: '본인의 관심주만 수정할 수 있습니다.' }, { status: 403 })
  }

  const { data: updated, error: updateError } = await supabase
    .from('watchlist_items')
    .update({ alert_enabled: body.alert_enabled })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: '알림 설정 변경에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json(updated)
}
