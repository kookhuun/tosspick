// @TASK P3-S4-V - S4 종목 상세 통합 검증
import { test, expect } from '@playwright/test'

test.describe('S4 종목 상세', () => {
  // NOTE: 실 데이터 없이 구조만 검증. DB에 005930(삼성전자) 시드 데이터 필요시 별도 설정.
  test('존재하지 않는 종목 → 404 반환', async ({ page }) => {
    const res = await page.goto('/stock/INVALID_TICKER_XYZ')
    // Next.js notFound() → 404
    expect(res?.status()).toBe(404)
  })

  test('API: 종목 검색 엔드포인트 응답 구조 확인', async ({ request }) => {
    const res = await request.get('/api/tickers/search?q=')
    expect(res.ok()).toBeTruthy()
    const json = await res.json()
    expect(json).toHaveProperty('tickers')
    expect(Array.isArray(json.tickers)).toBeTruthy()
  })

  test('API: 인기 종목 엔드포인트 응답 구조 확인', async ({ request }) => {
    const res = await request.get('/api/tickers/popular')
    expect(res.ok()).toBeTruthy()
    const json = await res.json()
    expect(json).toHaveProperty('tickers')
  })

  test('API: 존재하지 않는 종목 상세 → 404', async ({ request }) => {
    const res = await request.get('/api/tickers/INVALID_XYZ')
    expect(res.status()).toBe(404)
  })
})
