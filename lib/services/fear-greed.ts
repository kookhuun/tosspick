// @TASK P2-R2-T3 - 공포탐욕 지수 서비스
// @SPEC docs/planning/02-trd.md#공포탐욕-지수

import { createClient } from '@/lib/supabase/server'

export interface FearGreedData {
  score: number
  label: string
  updated_at: string
}

interface FearGreedAPIResponse {
  data: Array<{
    value: string
    value_classification: string
    timestamp: string
  }>
}

const CACHE_TTL_MS = 60 * 60 * 1000 // 1시간

function getLabel(score: number): string {
  if (score <= 24) return 'extreme_fear'
  if (score <= 44) return 'fear'
  if (score <= 55) return 'neutral'
  if (score <= 75) return 'greed'
  return 'extreme_greed'
}

/**
 * Alternative.me에서 공포탐욕 지수를 조회합니다 (1시간 캐싱).
 */
export async function getFearGreedIndex(): Promise<FearGreedData> {
  const supabase = await createClient()

  // 캐시 확인
  const oneHourAgo = new Date(Date.now() - CACHE_TTL_MS).toISOString()
  const { data: cached } = await supabase
    .from('fear_greed_index')
    .select('*')
    .gte('updated_at', oneHourAgo)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (cached) {
    return {
      score: cached.score,
      label: cached.label,
      updated_at: cached.updated_at,
    }
  }

  // API 호출
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=1')

    if (!response.ok) {
      throw new Error(`Fear & Greed API 응답 오류: ${response.status}`)
    }

    const apiData: FearGreedAPIResponse = await response.json()
    const entry = apiData.data?.[0]

    if (!entry) {
      throw new Error('Fear & Greed 데이터가 비어있습니다.')
    }

    const score = parseInt(entry.value, 10)
    const label = getLabel(score)
    const now = new Date().toISOString()

    // DB 저장
    await supabase
      .from('fear_greed_index')
      .insert({ score, label, updated_at: now })

    return { score, label, updated_at: now }
  } catch {
    // API 실패 시 DB의 마지막 데이터 반환
    const { data: stale } = await supabase
      .from('fear_greed_index')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (stale) {
      return {
        score: stale.score,
        label: stale.label,
        updated_at: stale.updated_at,
      }
    }

    // 데이터가 전혀 없는 경우 기본값
    return {
      score: 50,
      label: 'neutral',
      updated_at: new Date().toISOString(),
    }
  }
}
