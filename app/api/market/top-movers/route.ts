// @TASK P2-R2-T4 - GET /api/market/top-movers (상승/하락 TOP5)
// @SPEC docs/planning/02-trd.md#상승하락-TOP5-API

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') ?? 'gainers'

    if (type !== 'gainers' && type !== 'losers') {
      return NextResponse.json(
        { error: 'type 파라미터는 gainers 또는 losers만 허용됩니다.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tickers')
      .select('id, symbol, name, market, current_price, price_change, price_change_rate')
      .order('price_change_rate', { ascending: type === 'losers' })
      .limit(5)

    if (error) {
      return NextResponse.json(
        { error: `종목 조회 실패: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      type,
      tickers: data ?? [],
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
