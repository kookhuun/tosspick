// POST /api/ingest/tickers
// 외부 툴이 주식 현황을 일괄 upsert하는 엔드포인트
//
// Request body:
// {
//   tickers: [{
//     symbol: string,          // 종목 코드 (ex: "005930", "AAPL")
//     name: string,            // 종목명
//     market: "KOSPI" | "KOSDAQ" | "NYSE" | "NASDAQ",
//     current_price: number,
//     price_change: number,    // 전일 대비 변화량
//     price_change_rate: number, // 전일 대비 변화율 (%)
//     volume: number,
//     market_cap: number,
//     sector?: string          // 해외주식 섹터명
//   }]
// }

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyIngestKey } from '@/lib/ingest-auth'

export async function POST(request: Request) {
  if (!verifyIngestKey(request)) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 })
  }

  try {
    const { tickers } = await request.json()
    if (!Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json({ error: 'tickers 배열이 필요합니다.' }, { status: 400 })
    }

    const supabase = await createClient()
    const now = new Date().toISOString()

    const rows = tickers.map((t: Record<string, unknown>) => ({
      symbol: t.symbol,
      name: t.name,
      market: t.market,
      current_price: t.current_price,
      price_change: t.price_change,
      price_change_rate: t.price_change_rate,
      volume: t.volume,
      market_cap: t.market_cap,
      ...(t.sector ? { sector: t.sector } : {}),
      updated_at: now,
    }))

    const { error } = await supabase
      .from('tickers')
      .upsert(rows, { onConflict: 'symbol' })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ upserted: rows.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
