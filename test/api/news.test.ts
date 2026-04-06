// @TASK P2-R1-T1 - 뉴스 수집 + AI 요약 테스트
// @TEST test/api/news.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Mocks ---

// Supabase mock
const mockSelect = vi.fn()
const mockOrder = vi.fn()
const mockLimit = vi.fn()
const mockContains = vi.fn()
const mockUpsert = vi.fn()
const mockFrom = vi.fn()
const mockGte = vi.fn()
const mockSingle = vi.fn()

function buildChain(overrides: Record<string, unknown> = {}) {
  const chain: Record<string, unknown> = {
    select: mockSelect,
    order: mockOrder,
    limit: mockLimit,
    contains: mockContains,
    upsert: mockUpsert,
    gte: mockGte,
    single: mockSingle,
  }
  mockSelect.mockReturnValue(chain)
  mockOrder.mockReturnValue(chain)
  mockLimit.mockReturnValue(chain)
  mockContains.mockReturnValue(chain)
  mockGte.mockReturnValue(chain)
  mockSingle.mockReturnValue(chain)
  mockFrom.mockReturnValue(chain)
  Object.assign(chain, overrides)
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

// Anthropic SDK mock
const mockCreate = vi.fn()
vi.mock('@anthropic-ai/sdk', () => ({
  default: class MockAnthropic {
    messages = { create: mockCreate }
    constructor(_options?: unknown) {}
  },
}))

// Global fetch mock
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// --- Tests ---

describe('news-collector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NEWS_API_KEY', 'test-api-key')
  })

  it('NewsAPI에서 뉴스를 수집한다', async () => {
    const { collectNews } = await import('@/lib/services/news-collector')

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ok',
        totalResults: 2,
        articles: [
          {
            title: '삼성전자 실적 발표',
            description: '삼성전자가 3분기 실적을 발표했다.',
            url: 'https://example.com/1',
            publishedAt: '2026-04-05T10:00:00Z',
            source: { name: '한경' },
          },
          {
            title: 'KOSPI 상승',
            description: 'KOSPI가 1% 상승했다.',
            url: 'https://example.com/2',
            publishedAt: '2026-04-05T09:00:00Z',
            source: { name: '매일경제' },
          },
        ],
      }),
    })

    const result = await collectNews(2)
    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('삼성전자 실적 발표')
    expect(result[1].source.name).toBe('매일경제')
  })

  it('API 키가 없으면 에러를 던진다', async () => {
    vi.stubEnv('NEWS_API_KEY', '')
    const { collectNews } = await import('@/lib/services/news-collector')
    await expect(collectNews()).rejects.toThrow('NEWS_API_KEY')
  })
})

describe('news-summarizer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-anthropic-key')
  })

  it('뉴스를 AI로 요약한다', async () => {
    const { summarizeNews } = await import('@/lib/services/news-summarizer')

    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            summary_one_line: '삼성전자 3분기 실적 호조',
            impact_direction: 'positive',
            related_tickers: ['005930'],
          }),
        },
      ],
    })

    const result = await summarizeNews('삼성전자 실적 발표', '삼성전자가 3분기 실적을 발표했다.')
    expect(result.summary_one_line).toBe('삼성전자 3분기 실적 호조')
    expect(result.impact_direction).toBe('positive')
    expect(result.related_tickers).toEqual(['005930'])
  })

  it('JSON 파싱 실패 시 fallback 반환', async () => {
    const { summarizeNews } = await import('@/lib/services/news-summarizer')

    mockCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: '이것은 JSON이 아닙니다' }],
    })

    const result = await summarizeNews('테스트 뉴스 제목입니다', null)
    expect(result.summary_one_line).toBe('테스트 뉴스 제목입니다')
    expect(result.impact_direction).toBe('neutral')
    expect(result.related_tickers).toEqual([])
  })

  it('API 오류 시 fallback 반환', async () => {
    const { summarizeNews } = await import('@/lib/services/news-summarizer')

    mockCreate.mockRejectedValueOnce(new Error('API 오류'))

    const result = await summarizeNews('에러 테스트 뉴스', '본문')
    expect(result.summary_one_line).toBe('에러 테스트 뉴스')
    expect(result.impact_direction).toBe('neutral')
  })
})

describe('GET /api/news', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('뉴스 목록을 반환한다', async () => {
    const newsData = [
      { id: 1, title: '뉴스1', summary_one_line: '요약1', published_at: '2026-04-05T10:00:00Z' },
      { id: 2, title: '뉴스2', summary_one_line: '요약2', published_at: '2026-04-05T09:00:00Z' },
    ]

    buildChain()
    // The final call in the chain resolves the promise
    mockLimit.mockResolvedValueOnce({ data: newsData, error: null, count: 2 })

    const { GET } = await import('@/app/api/news/route')
    const request = new Request('http://localhost/api/news?limit=5')
    const response = await GET(request)

    expect(response).toBeDefined()
    // NextResponse.json returns Response
    const body = await response.json()
    expect(body.news).toHaveLength(2)
    expect(body.total).toBe(2)
  })

  it('related_ticker 필터가 적용된다', async () => {
    buildChain()
    mockContains.mockResolvedValueOnce({ data: [], error: null, count: 0 })

    const { GET } = await import('@/app/api/news/route')
    const request = new Request('http://localhost/api/news?related_ticker=005930')
    await GET(request)

    expect(mockContains).toHaveBeenCalledWith('related_tickers', ['005930'])
  })

  it('DB 에러 시 500 반환', async () => {
    buildChain()
    mockLimit.mockResolvedValueOnce({ data: null, error: { message: 'DB 오류' }, count: 0 })

    const { GET } = await import('@/app/api/news/route')
    const request = new Request('http://localhost/api/news')
    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toContain('DB 오류')
  })
})

describe('GET /api/cron/collect-news', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('NEWS_API_KEY', 'test-api-key')
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-anthropic-key')
    vi.stubEnv('CRON_SECRET', 'test-secret')
  })

  it('인증 실패 시 401 반환', async () => {
    const { GET } = await import('@/app/api/cron/collect-news/route')
    const request = new Request('http://localhost/api/cron/collect-news', {
      headers: { Authorization: 'Bearer wrong-secret' },
    })

    const response = await GET(request)
    expect(response.status).toBe(401)
  })

  it('인증 성공 시 뉴스를 수집하고 저장한다', async () => {
    // Mock fetch for NewsAPI
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ok',
        totalResults: 1,
        articles: [
          {
            title: '테스트 뉴스',
            description: '본문',
            url: 'https://example.com/test',
            publishedAt: '2026-04-05T10:00:00Z',
            source: { name: '테스트' },
          },
        ],
      }),
    })

    // Mock Anthropic
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            summary_one_line: '테스트 요약',
            impact_direction: 'neutral',
            related_tickers: [],
          }),
        },
      ],
    })

    // Mock Supabase upsert
    buildChain()
    mockUpsert.mockResolvedValueOnce({ error: null })

    const { GET } = await import('@/app/api/cron/collect-news/route')
    const request = new Request('http://localhost/api/cron/collect-news', {
      headers: { Authorization: 'Bearer test-secret' },
    })

    const response = await GET(request)
    const body = await response.json()

    expect(body.collected).toBeDefined()
  })
})
