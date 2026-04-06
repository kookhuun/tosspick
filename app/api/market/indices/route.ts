// @TASK P2-R2-T1 - GET /api/market/indices
// @SPEC docs/planning/02-trd.md#시장-지수-API

import { NextResponse } from 'next/server'
import { getMarketIndices } from '@/lib/services/market-data'

export async function GET() {
  try {
    const indices = await getMarketIndices()
    return NextResponse.json({ indices })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
