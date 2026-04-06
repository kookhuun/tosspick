// @TASK P4-R2 - 매매기록 손익 통계 API
// @SPEC docs/planning - 마이페이지 손익 통계

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: records, error } = await supabase
    .from('trade_records')
    .select('type, quantity, price')
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: '매매기록을 불러올 수 없습니다.' }, { status: 500 })
  }

  let totalBuy = 0
  let totalSell = 0

  for (const record of records ?? []) {
    const amount = record.price * record.quantity
    if (record.type === 'buy') {
      totalBuy += amount
    } else if (record.type === 'sell') {
      totalSell += amount
    }
  }

  const totalProfitLoss = totalSell - totalBuy
  const totalProfitRate = totalBuy > 0
    ? Math.round((totalProfitLoss / totalBuy) * 10000) / 100
    : 0

  return NextResponse.json({
    total_profit_loss: totalProfitLoss,
    total_profit_rate: totalProfitRate,
    total_buy: totalBuy,
    total_sell: totalSell,
  })
}
