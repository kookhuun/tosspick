// @TASK P2-R2-T1 - Alpha Vantage 시장 지수 클라이언트
// @SPEC docs/planning/02-trd.md#시장-지수-API

import { createClient } from '@/lib/supabase/server'

export interface MarketIndex {
  name: string
  current_value: number
  change: number
  change_rate: number
  updated_at: string
}

interface AlphaVantageQuote {
  'Global Quote': {
    '01. symbol': string
    '02. open': string
    '03. high': string
    '04. low': string
    '05. price': string
    '06. volume': string
    '07. latest trading day': string
    '08. previous close': string
    '09. change': string
    '10. change percent': string
  }
}

const INDEX_SYMBOLS: Record<string, string> = {
  '^KS11': 'KOSPI',
  '^KQ11': 'KOSDAQ',
  '^GSPC': 'S&P 500',
  '^IXIC': 'NASDAQ',
}

const CACHE_TTL_MS = 5 * 60 * 1000 // 5분

/**
 * Alpha Vantage에서 단일 심볼의 시세를 조회합니다.
 */
async function fetchQuote(symbol: string): Promise<MarketIndex | null> {
  const apiKey = process.env.ALPHA_VANTAGE_KEY
  if (!apiKey) return null

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`
    const response = await fetch(url)

    if (!response.ok) return null

    const data: AlphaVantageQuote = await response.json()
    const quote = data['Global Quote']

    if (!quote || !quote['05. price']) return null

    return {
      name: INDEX_SYMBOLS[symbol] ?? symbol,
      current_value: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      change_rate: parseFloat(quote['10. change percent'].replace('%', '')),
      updated_at: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

/**
 * 모든 시장 지수를 조회합니다 (5분 캐싱).
 */
export async function getMarketIndices(): Promise<MarketIndex[]> {
  const supabase = await createClient()

  // 캐시 확인
  const fiveMinutesAgo = new Date(Date.now() - CACHE_TTL_MS).toISOString()
  const { data: cached } = await supabase
    .from('market_indices')
    .select('*')
    .gte('updated_at', fiveMinutesAgo)

  if (cached && cached.length > 0) {
    return cached.map((row) => ({
      name: row.name,
      current_value: row.current_value,
      change: row.change,
      change_rate: row.change_rate,
      updated_at: row.updated_at,
    }))
  }

  // 캐시 미스: Alpha Vantage 호출
  const symbols = Object.keys(INDEX_SYMBOLS)
  const results: MarketIndex[] = []

  for (const symbol of symbols) {
    const quote = await fetchQuote(symbol)
    if (quote) {
      results.push(quote)

      // DB 업데이트 (upsert by name)
      await supabase
        .from('market_indices')
        .upsert(
          {
            name: quote.name,
            current_value: quote.current_value,
            change: quote.change,
            change_rate: quote.change_rate,
            updated_at: quote.updated_at,
          },
          { onConflict: 'name' }
        )
    }
  }

  // Alpha Vantage 실패 시 stale 데이터 반환
  if (results.length === 0) {
    const { data: stale } = await supabase
      .from('market_indices')
      .select('*')
      .order('updated_at', { ascending: false })

    if (stale && stale.length > 0) {
      return stale.map((row) => ({
        name: row.name,
        current_value: row.current_value,
        change: row.change,
        change_rate: row.change_rate,
        updated_at: row.updated_at,
      }))
    }
  }

  return results
}
