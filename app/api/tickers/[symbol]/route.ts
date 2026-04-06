// @TASK P3-R2-T1 - GET /api/tickers/[symbol] (종목 상세 데이터)
// @SPEC docs/planning/06-tasks.md#P3-R2-T1

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params
    const supabase = await createClient()

    // ticker 기본 정보 조회
    const { data: ticker, error: tickerError } = await supabase
      .from('tickers')
      .select('id, symbol, name, market, current_price, price_change, price_change_rate, volume, market_cap')
      .eq('symbol', symbol.toUpperCase())
      .single()

    if (tickerError || !ticker) {
      return NextResponse.json({ error: '종목을 찾을 수 없습니다.' }, { status: 404 })
    }

    // ticker_detail 조회
    const { data: detail } = await supabase
      .from('ticker_details')
      .select('per, pbr, eps, dividend_rate, chart_data, ai_earnings_summary, ai_opinion, ai_opinion_reason, ai_causal_story, next_earnings_date, ai_analyzed_at')
      .eq('ticker_id', ticker.id)
      .single()

    return NextResponse.json({ ticker, detail: detail ?? null })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
