// ================================================================
// 시장 데이터 갱신 함수 — 나중에 cron이 호출할 함수
// ================================================================
//
// [지금] 구조만 준비. 실제 외부 API 호출 로직은 TODO.
//
// [나중에 cron 붙이는 방법]
// 1. 아래 TODO 함수들에 실제 Alpha Vantage / Yahoo Finance 호출 구현
// 2. app/api/cron/refresh-market/route.ts 에서 이 함수들 호출
// 3. vercel.json 에 cron 설정 추가
// 4. POST /api/revalidate?tag=market 로 캐시 무효화
//
// ================================================================

import { revalidateTag } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

export interface MarketIndexInput {
  id: 'KOSPI' | 'KOSDAQ' | 'SPX' | 'IXIC'
  name: string
  current_value: number
  change: number
  change_rate: number
}

export interface SectorInput {
  name: string
  change_rate: number
  color: string
}

export interface FearGreedInput {
  score: number
  label: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed'
}

/**
 * 시장 지수를 DB에 저장하고 캐시를 무효화한다.
 * POST /api/ingest/market-indices 와 동일한 역할이지만 서버 내부에서 직접 호출 가능.
 */
export async function saveMarketIndices(indices: MarketIndexInput[]): Promise<void> {
  const supabase = createPublicClient()
  await supabase
    .from('market_indices')
    .upsert(indices.map((i) => ({ ...i, updated_at: new Date().toISOString() })), { onConflict: 'id' })
  revalidateTag('market', 'max')
}

export async function saveSectors(sectors: SectorInput[]): Promise<void> {
  const supabase = createPublicClient()
  await supabase
    .from('sectors')
    .upsert(sectors.map((s) => ({ ...s, updated_at: new Date().toISOString() })), { onConflict: 'name' })
  revalidateTag('market', 'max')
}

export async function saveFearGreed(data: FearGreedInput): Promise<void> {
  const supabase = createPublicClient()
  await supabase
    .from('fear_greed_index')
    .upsert({ id: 1, ...data, updated_at: new Date().toISOString() })
  revalidateTag('market', 'max')
}

/**
 * TODO: 외부 API에서 시장 지수/섹터/공포탐욕 수집 → 저장
 *
 * 구현 시 필요한 것:
 * - ALPHA_VANTAGE_API_KEY 또는 Yahoo Finance 비공식 API
 * - 공포탐욕 지수: alternative.me/api/
 */
export async function collectAndSaveMarket(): Promise<void> {
  // TODO: 구현 예정
  console.warn('[refresh/market] collectAndSaveMarket: 아직 구현되지 않았습니다.')
}
