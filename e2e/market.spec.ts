// @TASK P2-S2-V - S2 시장 E2E
import { test, expect } from '@playwright/test'

test.describe('S2 시장 대시보드', () => {
  test('시장 페이지 접속 시 대시보드 타이틀이 있다', async ({ page }) => {
    await page.goto('/market')
    await expect(page.getByText('시장 대시보드')).toBeVisible()
  })
})
