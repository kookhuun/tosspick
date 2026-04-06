// @TASK P2-R1-T1 - GET /api/news
// @SPEC docs/planning/02-trd.md#뉴스-API

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = parseInt(searchParams.get('limit') ?? '5', 10)
    const limit = Math.min(Math.max(1, isNaN(limitParam) ? 5 : limitParam), 20)
    const relatedTicker = searchParams.get('related_ticker')

    const supabase = await createClient()

    let query = supabase
      .from('news_items')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .limit(limit)

    if (relatedTicker) {
      query = query.contains('related_tickers', [relatedTicker])
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: `뉴스 조회 실패: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      news: data ?? [],
      total: count ?? 0,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
