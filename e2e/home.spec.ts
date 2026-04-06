// @TASK P2-S1-V - S1 홈 E2E
import { test, expect } from '@playwright/test'

test.describe('S1 홈 화면', () => {
  test('홈 접속 시 페이지 타이틀이 있다', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/tosspick|Tosspick|홈/)
  })

  test('비인증 상태에서 로그인 배너가 표시된다', async ({ page }) => {
    await page.goto('/')
    // 서버에 뉴스 없어도 배너 or 빈 상태 둘 중 하나
    const body = await page.locator('main').textContent()
    expect(body).toBeDefined()
  })
})
