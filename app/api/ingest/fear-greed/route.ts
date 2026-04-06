// POST /api/ingest/fear-greed
// 외부 툴이 공포탐욕 지수를 업데이트하는 엔드포인트
//
// Request body:
// {
//   score: number,   // 0~100
//   label: "extreme_fear" | "fear" | "neutral" | "greed" | "extreme_greed"
// }

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyIngestKey } from '@/lib/ingest-auth'

const VALID_LABELS = ['extreme_fear', 'fear', 'neutral', 'greed', 'extreme_greed']

export async function POST(request: Request) {
  if (!verifyIngestKey(request)) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 })
  }

  try {
    const { score, label } = await request.json()

    if (typeof score !== 'number' || score < 0 || score > 100) {
      return NextResponse.json({ error: 'score는 0~100 사이 숫자여야 합니다.' }, { status: 400 })
    }
    if (!VALID_LABELS.includes(label)) {
      return NextResponse.json({ error: `label은 ${VALID_LABELS.join(', ')} 중 하나여야 합니다.` }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('fear_greed_index')
      .upsert({ id: 1, score, label, updated_at: new Date().toISOString() })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, score, label })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
