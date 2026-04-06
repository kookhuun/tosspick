// POST /api/ingest/global-indicators
// 외부 툴이 환율/원자재/채권 지표를 업데이트하는 엔드포인트
//
// Request body:
// {
//   indicators: [{
//     type: "exchange_rate" | "commodity" | "bond",
//     name: string,             // ex: "USD/KRW", "WTI 원유", "미국 10년물"
//     value: number,
//     change: number,
//     change_rate: number,
//     ai_impact_summary?: string // ex: "달러 강세 → 수출주 긍정적" 50자 이내
//   }]
// }

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyIngestKey } from '@/lib/ingest-auth'

const VALID_TYPES = ['exchange_rate', 'commodity', 'bond']

export async function POST(request: Request) {
  if (!verifyIngestKey(request)) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 })
  }

  try {
    const { indicators } = await request.json()
    if (!Array.isArray(indicators) || indicators.length === 0) {
      return NextResponse.json({ error: 'indicators 배열이 필요합니다.' }, { status: 400 })
    }

    const invalid = indicators.filter(
      (i: Record<string, unknown>) => !VALID_TYPES.includes(i.type as string)
    )
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `유효하지 않은 type. 허용값: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const now = new Date().toISOString()

    const { error } = await supabase
      .from('global_indicators')
      .upsert(
        indicators.map((i: Record<string, unknown>) => ({ ...i, updated_at: now })),
        { onConflict: 'name' }
      )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ upserted: indicators.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
