// @TASK P4-R2 - 실적 발표 일정 조회 API
// @SPEC docs/planning - 마이페이지 실적 일정

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tickerIdsParam = searchParams.get('ticker_ids')
  const futureOnly = searchParams.get('future_only') === 'true'

  const supabase = await createClient()

  let query = supabase
    .from('earnings_events')
    .select('id, ticker_id, scheduled_date, is_confirmed, result_eps, result_revenue, tickers(symbol, name)')
    .order('scheduled_date', { ascending: true })

  if (tickerIdsParam) {
    const tickerIds = tickerIdsParam.split(',').map((id) => id.trim()).filter(Boolean)
    if (tickerIds.length > 0) {
      query = query.in('ticker_id', tickerIds)
    }
  }

  if (futureOnly) {
    const today = new Date().toISOString().split('T')[0]
    query = query.gt('scheduled_date', today)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: '실적 일정을 불러올 수 없습니다.' }, { status: 500 })
  }

  const events = (data ?? []).map(({ tickers, ...rest }) => ({
    ...rest,
    ticker: tickers,
  }))

  return NextResponse.json(events)
}
