// @TASK P2-R2-T2 - GET /api/market/sectors (섹터 히트맵)
// @SPEC docs/planning/02-trd.md#섹터-히트맵-API

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Sector {
  id: number | string
  name: string
  change_rate: number
  color: string
}

function getColorByChangeRate(changeRate: number): string {
  if (changeRate >= 2) return 'bg-green-600'
  if (changeRate > 0) return 'bg-green-400'
  if (changeRate === 0) return 'bg-gray-400'
  if (changeRate > -2) return 'bg-red-400'
  return 'bg-red-600'
}

const SEED_SECTORS: Sector[] = [
  '반도체', '자동차', '바이오', '금융', '에너지', '소비재', '통신', '철강',
].map((name, idx) => ({
  id: idx + 1,
  name,
  change_rate: 0,
  color: 'bg-gray-400',
}))

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('sectors')
      .select('*')

    if (error || !data || data.length === 0) {
      return NextResponse.json({ sectors: SEED_SECTORS })
    }

    const sectors: Sector[] = data.map((row) => ({
      id: row.id,
      name: row.name,
      change_rate: row.change_rate,
      color: getColorByChangeRate(row.change_rate),
    }))

    return NextResponse.json({ sectors })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
