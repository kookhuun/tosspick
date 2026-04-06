// @TASK P3-S3-V - S3 검색 통합 검증
import { test, expect } from '@playwright/test'

test.describe('S3 검색 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  test('검색 페이지 접속 시 검색창이 있다', async ({ page }) => {
    await expect(page.getByPlaceholder('종목명 또는 코드 검색')).toBeVisible()
  })

  test('검색어 없음 → 인기 종목 TOP 10 섹션이 표시된다', async ({ page }) => {
    await expect(page.getByText('인기 종목 TOP 10')).toBeVisible()
  })

  test('검색어 입력 → 검색 결과 섹션으로 전환된다', async ({ page }) => {
    await page.getByPlaceholder('종목명 또는 코드 검색').fill('삼성')
    await expect(page.getByText(/검색 결과/)).toBeVisible({ timeout: 2000 })
  })

  test('✕ 버튼 클릭 → 검색어 초기화', async ({ page }) => {
    const input = page.getByPlaceholder('종목명 또는 코드 검색')
    await input.fill('삼성')
    await page.getByRole('button', { name: '✕' }).click()
    await expect(input).toHaveValue('')
  })
})
