// @TASK P3-R1-T1 - GET /api/tickers/search?q= (종목 검색 + 자동완성)
// @SPEC docs/planning/06-tasks.md#P3-R1-T1

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim() ?? ''
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)

    const supabase = await createClient()

    if (!q) {
      // 빈 쿼리 → 인기 종목 10개 (volume 기준)
      const { data, error } = await supabase
        .from('tickers')
        .select('id, symbol, name, market, current_price, price_change_rate')
        .order('volume', { ascending: false })
        .limit(10)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ query: '', tickers: data ?? [] })
    }

    // symbol 또는 name ilike 검색
    const { data, error } = await supabase
      .from('tickers')
      .select('id, symbol, name, market, current_price, price_change_rate')
      .or(`symbol.ilike.%${q}%,name.ilike.%${q}%`)
      .order('volume', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ query: q, tickers: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
