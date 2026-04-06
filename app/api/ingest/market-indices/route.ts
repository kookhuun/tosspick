// POST /api/ingest/market-indices
// 외부 툴이 시장 지수를 업데이트하는 엔드포인트
//
// Request body:
// {
//   indices: [{
//     id: "KOSPI" | "KOSDAQ" | "SPX" | "IXIC",
//     name: string,
//     current_value: number,
//     change: number,
//     change_rate: number
//   }]
// }

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyIngestKey } from '@/lib/ingest-auth'

const VALID_IDS = ['KOSPI', 'KOSDAQ', 'SPX', 'IXIC']

export async function POST(request: Request) {
  if (!verifyIngestKey(request)) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 })
  }

  try {
    const { indices } = await request.json()
    if (!Array.isArray(indices) || indices.length === 0) {
      return NextResponse.json({ error: 'indices 배열이 필요합니다.' }, { status: 400 })
    }

    const invalid = indices.filter((i: Record<string, unknown>) => !VALID_IDS.includes(i.id as string))
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `유효하지 않은 id: ${invalid.map((i: Record<string, unknown>) => i.id).join(', ')}. 허용값: ${VALID_IDS.join(', ')}` },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const now = new Date().toISOString()

    const { error } = await supabase
      .from('market_indices')
      .upsert(
        indices.map((i: Record<string, unknown>) => ({ ...i, updated_at: now })),
        { onConflict: 'id' }
      )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ upserted: indices.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
