// @TASK P2-R2-T3 - GET /api/market/fear-greed
// @SPEC docs/planning/02-trd.md#공포탐욕-지수-API

import { NextResponse } from 'next/server'
import { getFearGreedIndex } from '@/lib/services/fear-greed'

export async function GET() {
  try {
    const data = await getFearGreedIndex()
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
