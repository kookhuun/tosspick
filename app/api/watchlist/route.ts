// @TASK P4-R2 - 관심주 목록 조회 및 추가 API
// @SPEC docs/planning - 마이페이지 관심주 기능

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('watchlist_items')
    .select('id, ticker_id, added_at, alert_enabled, tickers(symbol, name, current_price, price_change, price_change_rate)')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: '관심주 목록을 불러올 수 없습니다.' }, { status: 500 })
  }

  const items = (data ?? []).map(({ tickers, ...rest }) => ({
    ...rest,
    ticker: tickers,
  }))

  return NextResponse.json(items)
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  let body: { ticker_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
  }

  const { ticker_id } = body
  if (!ticker_id) {
    return NextResponse.json({ error: 'ticker_id는 필수입니다.' }, { status: 400 })
  }

  const supabase = await createClient()

  // 중복 체크
  const { data: existing } = await supabase
    .from('watchlist_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('ticker_id', ticker_id)
    .single()

  if (existing) {
    return NextResponse.json({ error: '이미 관심주에 추가된 종목입니다.' }, { status: 409 })
  }

  const { data: item, error } = await supabase
    .from('watchlist_items')
    .insert({
      user_id: user.id,
      ticker_id,
      alert_enabled: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: '관심주 추가에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json(item, { status: 201 })
}
