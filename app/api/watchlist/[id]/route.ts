// @TASK P4-R2 - 관심주 삭제 API

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getAuthUser()

  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: item, error: fetchError } = await supabase
    .from('watchlist_items')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (fetchError || !item) {
    return NextResponse.json({ error: '관심주를 찾을 수 없습니다.' }, { status: 404 })
  }

  if (item.user_id !== user.id) {
    return NextResponse.json({ error: '본인의 관심주만 삭제할 수 있습니다.' }, { status: 403 })
  }

  const { error: deleteError } = await supabase
    .from('watchlist_items')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: '관심주 삭제에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ message: '관심주가 삭제되었습니다.' })
}
