// ================================================================
// 주식 현황 갱신 함수 — 나중에 cron이 호출할 함수
// ================================================================
//
// [지금] 구조만 준비. 실제 외부 API 호출 로직은 TODO.
//
// [나중에 cron 붙이는 방법]
// 1. 아래 TODO 함수에 실제 주식 API 호출 구현
// 2. app/api/cron/refresh-tickers/route.ts 에서 이 함수 호출
// 3. vercel.json 에 cron 설정 추가
//
// ================================================================

import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

export interface TickerInput {
  symbol: string
  name: string
  market: 'KOSPI' | 'KOSDAQ' | 'NYSE' | 'NASDAQ'
  current_price: number
  price_change: number
  price_change_rate: number
  volume: number
  market_cap: number
  sector?: string
}

/**
 * 종목 현황을 DB에 저장하고 캐시를 무효화한다.
 */
export async function saveTickers(tickers: TickerInput[]): Promise<void> {
  const supabase = createPublicClient()
  await supabase
    .from('tickers')
    .upsert(
      tickers.map((t) => ({ ...t, updated_at: new Date().toISOString() })),
      { onConflict: 'symbol' }
    )
  revalidateTag('tickers', 'max')
}

/**
 * TODO: 외부 주식 API에서 현황 수집 → 저장
 *
 * 구현 시 필요한 것:
 * - 국내: 한국투자증권 Open API 또는 KIS Developers
 * - 해외: Alpha Vantage (무료 25회/일) 또는 Financial Modeling Prep
 * - 또는 Yahoo Finance 비공식 API (rate limit 주의)
 */
export async function collectAndSaveTickers(): Promise<void> {
  // TODO: 구현 예정
  console.warn('[refresh/tickers] collectAndSaveTickers: 아직 구현되지 않았습니다.')
}
