// @TASK P4-R2 - 매매기록 목록 조회 및 추가 API
// @SPEC docs/planning - 마이페이지 매매기록 기능

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

const VALID_TYPES = ['buy', 'sell'] as const

export async function GET() {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('trade_records')
    .select('id, ticker_id, type, quantity, price, recorded_at, memo, tickers(symbol, name, current_price)')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: '매매기록을 불러올 수 없습니다.' }, { status: 500 })
  }

  const records = (data ?? []).map(({ tickers, ...rest }) => ({
    ...rest,
    ticker: tickers,
  }))

  return NextResponse.json(records)
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  let body: {
    ticker_id?: string
    type?: string
    quantity?: number
    price?: number
    recorded_at?: string
    memo?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청 형식입니다.' }, { status: 400 })
  }

  const { ticker_id, type, quantity, price, recorded_at, memo } = body

  if (!ticker_id || !type || quantity == null || price == null || !recorded_at) {
    return NextResponse.json({ error: 'ticker_id, type, quantity, price, recorded_at는 필수입니다.' }, { status: 400 })
  }

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return NextResponse.json({ error: 'type은 buy 또는 sell만 가능합니다.' }, { status: 400 })
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return NextResponse.json({ error: 'quantity는 0보다 큰 숫자여야 합니다.' }, { status: 400 })
  }

  if (typeof price !== 'number' || price <= 0) {
    return NextResponse.json({ error: 'price는 0보다 큰 숫자여야 합니다.' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: record, error } = await supabase
    .from('trade_records')
    .insert({
      user_id: user.id,
      ticker_id,
      type,
      quantity,
      price,
      recorded_at,
      memo: memo?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: '매매기록 추가에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json(record, { status: 201 })
}
