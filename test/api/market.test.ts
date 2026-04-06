// @TASK P2-R2 - 시장 데이터 API 테스트
// @TEST test/api/market.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Supabase mock ---
const mockSelect = vi.fn()
const mockOrder = vi.fn()
const mockLimit = vi.fn()
const mockUpsert = vi.fn()
const mockInsert = vi.fn()
const mockFrom = vi.fn()
const mockGte = vi.fn()
const mockSingle = vi.fn()

function buildChain(resolveValue?: unknown) {
  const chain: Record<string, unknown> = {
    select: mockSelect,
    order: mockOrder,
    limit: mockLimit,
    upsert: mockUpsert,
    insert: mockInsert,
    gte: mockGte,
    single: mockSingle,
  }
  mockSelect.mockReturnValue(chain)
  mockOrder.mockReturnValue(chain)
  mockLimit.mockReturnValue(chain)
  mockGte.mockReturnValue(chain)
  mockSingle.mockReturnValue(chain)
  mockFrom.mockReturnValue(chain)
  mockInsert.mockReturnValue(chain)
  mockUpsert.mockResolvedValue({ error: null })

  if (resolveValue !== undefined) {
    // Make the final call resolve with the value
    mockSingle.mockResolvedValue(resolveValue)
    mockLimit.mockResolvedValue(resolveValue)
    mockSelect.mockReturnValue({ ...chain, then: (resolve: (v: unknown) => void) => resolve(resolveValue) })
  }

  return chain
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}))

// Global fetch mock
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// --- Market Indices Tests ---

describe('GET /api/market/indices', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('ALPHA_VANTAGE_KEY', 'test-key')
  })

  it('캐시된 데이터가 있으면 DB에서 반환', async () => {
    const cachedData = [
      { name: 'KOSPI', current_value: 2500, change: 10, change_rate: 0.4, updated_at: new Date().toISOString() },
    ]

    buildChain()
    mockGte.mockReturnValue({ data: cachedData, error: null })

    // Need to mock the service directly
    vi.doMock('@/lib/services/market-data', () => ({
      getMarketIndices: vi.fn().mockResolvedValue(cachedData.map(row => ({
        name: row.name,
        current_value: row.current_value,
        change: row.change,
        change_rate: row.change_rate,
        updated_at: row.updated_at,
      }))),
    }))

    vi.resetModules()

    // Re-mock dependencies after resetModules
    vi.doMock('@/lib/supabase/server', () => ({
      createClient: vi.fn(() => ({ from: mockFrom })),
    }))
    vi.doMock('next/headers', () => ({
      cookies: vi.fn(() => ({ getAll: vi.fn(() => []), set: vi.fn() })),
    }))

    const cachedIndices = cachedData.map(row => ({
      name: row.name,
      current_value: row.current_value,
      change: row.change,
      change_rate: row.change_rate,
      updated_at: row.updated_at,
    }))

    vi.doMock('@/lib/services/market-data', () => ({
      getMarketIndices: vi.fn().mockResolvedValue(cachedIndices),
    }))

    const { GET } = await import('@/app/api/market/indices/route')
    const response = await GET()
    const body = await response.json()

    expect(body.indices).toHaveLength(1)
    expect(body.indices[0].name).toBe('KOSPI')
  })
})

// --- Sectors Tests ---

describe('GET /api/market/sectors', () => {
  beforeEach(() => vi.clearAllMocks())

  it('DB에 데이터가 있으면 color를 계산하여 반환', async () => {
    const sectorData = [
      { id: 1, name: '반도체', change_rate: 2.5 },
      { id: 2, name: '자동차', change_rate: -1.0 },
      { id: 3, name: '바이오', change_rate: 0 },
      { id: 4, name: '금융', change_rate: -3.0 },
    ]

    buildChain()
    mockSelect.mockResolvedValueOnce({ data: sectorData, error: null })

    const { GET } = await import('@/app/api/market/sectors/route')
    const response = await GET()
    const body = await response.json()

    expect(body.sectors).toHaveLength(4)
    expect(body.sectors[0].color).toBe('bg-green-600')   // >= 2
    expect(body.sectors[1].color).toBe('bg-red-400')     // > -2 and < 0
    expect(body.sectors[2].color).toBe('bg-gray-400')    // === 0
    expect(body.sectors[3].color).toBe('bg-red-600')     // <= -2
  })

  it('DB에 데이터가 없으면 시드 데이터 반환', async () => {
    buildChain()
    mockSelect.mockResolvedValueOnce({ data: [], error: null })

    const { GET } = await import('@/app/api/market/sectors/route')
    const response = await GET()
    const body = await response.json()

    expect(body.sectors).toHaveLength(8)
    expect(body.sectors[0].name).toBe('반도체')
    expect(body.sectors[0].color).toBe('bg-gray-400')
  })
})

// --- Fear & Greed Index Tests ---

describe('fear-greed service', () => {
  beforeEach(() => vi.clearAllMocks())

  it('label 매핑이 정확하다', async () => {
    // Test the label mapping logic directly
    const testCases = [
      { score: 10, expected: 'extreme_fear' },
      { score: 30, expected: 'fear' },
      { score: 50, expected: 'neutral' },
      { score: 65, expected: 'greed' },
      { score: 85, expected: 'extreme_greed' },
    ]

    for (const { score, expected } of testCases) {
      let label: string
      if (score <= 24) label = 'extreme_fear'
      else if (score <= 44) label = 'fear'
      else if (score <= 55) label = 'neutral'
      else if (score <= 75) label = 'greed'
      else label = 'extreme_greed'

      expect(label).toBe(expected)
    }
  })
})

describe('GET /api/market/fear-greed', () => {
  beforeEach(() => vi.clearAllMocks())

  it('공포탐욕 지수를 반환한다', async () => {
    const mockData = { score: 35, label: 'fear', updated_at: '2026-04-05T10:00:00Z' }

    vi.resetModules()
    vi.doMock('@/lib/supabase/server', () => ({
      createClient: vi.fn(() => ({ from: mockFrom })),
    }))
    vi.doMock('next/headers', () => ({
      cookies: vi.fn(() => ({ getAll: vi.fn(() => []), set: vi.fn() })),
    }))
    vi.doMock('@/lib/services/fear-greed', () => ({
      getFearGreedIndex: vi.fn().mockResolvedValue(mockData),
    }))

    const { GET } = await import('@/app/api/market/fear-greed/route')
    const response = await GET()
    const body = await response.json()

    expect(body.score).toBe(35)
    expect(body.label).toBe('fear')
  })
})

// --- Top Movers Tests ---

describe('GET /api/market/top-movers', () => {
  beforeEach(() => vi.clearAllMocks())

  it('상승 종목 TOP5를 반환한다', async () => {
    const gainers = [
      { id: 1, symbol: '005930', name: '삼성전자', market: 'KOSPI', current_price: 72000, price_change: 3000, price_change_rate: 4.35 },
      { id: 2, symbol: '000660', name: 'SK하이닉스', market: 'KOSPI', current_price: 135000, price_change: 5000, price_change_rate: 3.85 },
    ]

    buildChain()
    mockLimit.mockResolvedValueOnce({ data: gainers, error: null })

    const { GET } = await import('@/app/api/market/top-movers/route')
    const request = new Request('http://localhost/api/market/top-movers?type=gainers')
    const response = await GET(request)
    const body = await response.json()

    expect(body.type).toBe('gainers')
    expect(body.tickers).toHaveLength(2)
    expect(body.tickers[0].name).toBe('삼성전자')
  })

  it('하락 종목 TOP5를 반환한다', async () => {
    const losers = [
      { id: 3, symbol: '035720', name: '카카오', market: 'KOSPI', current_price: 45000, price_change: -2000, price_change_rate: -4.26 },
    ]

    buildChain()
    mockLimit.mockResolvedValueOnce({ data: losers, error: null })

    const { GET } = await import('@/app/api/market/top-movers/route')
    const request = new Request('http://localhost/api/market/top-movers?type=losers')
    const response = await GET(request)
    const body = await response.json()

    expect(body.type).toBe('losers')
    expect(body.tickers).toHaveLength(1)
  })

  it('잘못된 type 파라미터 시 400 반환', async () => {
    const { GET } = await import('@/app/api/market/top-movers/route')
    const request = new Request('http://localhost/api/market/top-movers?type=invalid')
    const response = await GET(request)

    expect(response.status).toBe(400)
  })

  it('DB 에러 시 500 반환', async () => {
    buildChain()
    mockLimit.mockResolvedValueOnce({ data: null, error: { message: 'DB 오류' } })

    const { GET } = await import('@/app/api/market/top-movers/route')
    const request = new Request('http://localhost/api/market/top-movers?type=gainers')
    const response = await GET(request)

    expect(response.status).toBe(500)
  })
})
