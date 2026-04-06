// POST /api/ingest/news
// 외부 툴이 뉴스(AI 요약 포함)를 upsert하는 엔드포인트
//
// Request body:
// {
//   items: [{
//     title: string,
//     summary_one_line: string,   // AI 요약 (50자 이내)
//     impact_direction: "positive" | "negative" | "neutral",
//     related_tickers: string[],  // 관련 종목 코드 최대 3개
//     source_url: string,         // 원문 URL (unique key)
//     published_at: string        // ISO 8601
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
    const { items } = await request.json()
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items 배열이 필요합니다.' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error, count } = await supabase
      .from('news_items')
      .upsert(
        items.map((item: Record<string, unknown>) => ({
          ...item,
          collected_at: new Date().toISOString(),
        })),
        { onConflict: 'source_url', ignoreDuplicates: true, count: 'exact' }
      )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ upserted: count ?? items.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
