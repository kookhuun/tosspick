// POST /api/ingest/sectors
// 외부 툴이 섹터별 변동률을 업데이트하는 엔드포인트
//
// Request body:
// {
//   sectors: [{
//     name: string,          // 섹터명 (unique key)
//     change_rate: number,   // 변동률 (%)
//     color: string          // Tailwind 배경 클래스 (ex: "bg-green-500", "bg-red-400")
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
    const { sectors } = await request.json()
    if (!Array.isArray(sectors) || sectors.length === 0) {
      return NextResponse.json({ error: 'sectors 배열이 필요합니다.' }, { status: 400 })
    }

    const supabase = await createClient()
    const now = new Date().toISOString()

    const { error } = await supabase
      .from('sectors')
      .upsert(
        sectors.map((s: Record<string, unknown>) => ({ ...s, updated_at: now })),
        { onConflict: 'name' }
      )

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ upserted: sectors.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
