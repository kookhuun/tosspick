// @TASK P3-R1-T2 - GET /api/tickers/popular (인기 종목 TOP10)
// @SPEC docs/planning/06-tasks.md#P3-R1-T2

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tickers')
      .select('id, symbol, name, market, current_price, price_change_rate')
      .order('volume', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ tickers: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
