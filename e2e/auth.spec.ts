import { test, expect } from '@playwright/test'

/**
 * P1-S7-V: S7 인증 통합 E2E 테스트
 *
 * Supabase Auth API를 page.route()로 모킹하여
 * 실제 Supabase 인스턴스 없이도 실행 가능.
 */

// Supabase URL 패턴
const SUPABASE_AUTH = '**/auth/v1/**'

/** 로그인 성공 응답 모킹 */
async function mockLoginSuccess(page: import('@playwright/test').Page) {
  await page.route(`${SUPABASE_AUTH}`, async (route) => {
    const url = route.request().url()
    if (url.includes('/token')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            role: 'authenticated',
          },
        }),
      })
    } else if (url.includes('/user')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'mock-user-id',
          email: 'test@example.com',
          role: 'authenticated',
        }),
      })
    } else {
      await route.continue()
    }
  })
}

/** 로그인 실패 응답 모킹 */
async function mockLoginFailure(page: import('@playwright/test').Page) {
  await page.route(`${SUPABASE_AUTH}`, async (route) => {
    const url = route.request().url()
    if (url.includes('/token')) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid login credentials',
        }),
      })
    } else {
      await route.continue()
    }
  })
}

/** 미인증 상태 모킹 (세션 없음) */
async function mockUnauthenticated(page: import('@playwright/test').Page) {
  await page.route(`${SUPABASE_AUTH}`, async (route) => {
    const url = route.request().url()
    if (url.includes('/user')) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'JWT expired' }),
      })
    } else {
      await route.continue()
    }
  })
}

test.describe('S7 인증 E2E 테스트', () => {
  test('/auth 페이지 기본 렌더링', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByText('로그인')).toBeVisible()
    await expect(page.getByText('회원가입')).toBeVisible()
    await expect(page.getByPlaceholder('이메일')).toBeVisible()
  })

  test('로그인/회원가입 탭 전환', async ({ page }) => {
    await page.goto('/auth')

    // 기본: 로그인 탭
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible()

    // 회원가입 탭 클릭
    await page.getByRole('button', { name: '회원가입' }).first().click()
    await expect(page.getByPlaceholder('닉네임')).toBeVisible()
  })

  test('잘못된 비밀번호 → 에러 메시지 표시', async ({ page }) => {
    await mockLoginFailure(page)
    await page.goto('/auth')

    await page.fill('input[placeholder="이메일"]', 'test@example.com')
    await page.fill('input[placeholder="비밀번호"]', 'wrongpassword')
    await page.getByRole('button', { name: /로그인/ }).click()

    // 에러 메시지가 표시되어야 함
    await expect(
      page.getByText(/로그인|오류|실패|Invalid|error/i)
    ).toBeVisible({ timeout: 5000 })
  })

  test('회원가입 비밀번호 불일치 에러', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: '회원가입' }).first().click()

    await page.fill('input[placeholder="이메일"]', 'newuser@example.com')
    await page.fill('input[placeholder="닉네임"]', '테스터')
    await page.fill('input[placeholder="비밀번호"]', 'Password123!')
    await page.fill('input[placeholder="비밀번호 확인"]', 'Different123!')
    await page.getByRole('button', { name: /회원가입/ }).click()

    await expect(page.getByText('비밀번호가 일치하지 않습니다.')).toBeVisible()
  })

  test('비인증 상태에서 /my 접속 → /auth 리다이렉트', async ({ page }) => {
    // AuthGuard가 /my 접속 시 /auth로 리다이렉트해야 함
    await mockUnauthenticated(page)
    await page.goto('/my')

    // /auth 페이지로 리다이렉트 되거나 auth 컨텐츠가 보여야 함
    await expect(page).toHaveURL(/\/auth/, { timeout: 5000 })
  })
})
