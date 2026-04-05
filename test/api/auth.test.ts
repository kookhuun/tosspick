import { describe, it, expect, vi, beforeEach } from 'vitest'

// Supabase mock
const mockSignInWithPassword = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()
const mockGetUser = vi.fn()
const mockExchangeCodeForSession = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getUser: mockGetUser,
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  })),
}))

// next/headers mock
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}))

// next/server mock
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data: unknown, init?: ResponseInit) => ({ data, status: init?.status ?? 200 })),
    redirect: vi.fn((url: string) => ({ redirect: url })),
  },
}))

import { signIn, signUp, signOut, getAuthUser } from '@/lib/auth'

describe('lib/auth.ts', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('signIn', () => {
    it('성공 시 user 반환', async () => {
      const fakeUser = { id: 'user-1', email: 'test@example.com' }
      mockSignInWithPassword.mockResolvedValue({ data: { user: fakeUser }, error: null })

      const result = await signIn('test@example.com', 'password123')
      expect(result.user).toEqual(fakeUser)
      expect(result.error).toBeNull()
    })

    it('실패 시 error 반환', async () => {
      mockSignInWithPassword.mockResolvedValue({ data: { user: null }, error: { message: '잘못된 비밀번호' } })

      const result = await signIn('test@example.com', 'wrong')
      expect(result.user).toBeNull()
      expect(result.error?.message).toBe('잘못된 비밀번호')
    })
  })

  describe('signUp', () => {
    it('성공 시 user 반환', async () => {
      const fakeUser = { id: 'user-2', email: 'new@example.com' }
      mockSignUp.mockResolvedValue({ data: { user: fakeUser }, error: null })

      const result = await signUp('new@example.com', 'Password123!', '닉네임')
      expect(result.user).toEqual(fakeUser)
      expect(result.error).toBeNull()
    })
  })

  describe('getAuthUser', () => {
    it('인증된 사용자 반환', async () => {
      const fakeUser = { id: 'user-1', email: 'test@example.com' }
      mockGetUser.mockResolvedValue({ data: { user: fakeUser }, error: null })

      const user = await getAuthUser()
      expect(user).toEqual(fakeUser)
    })

    it('미인증 시 null 반환', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

      const user = await getAuthUser()
      expect(user).toBeNull()
    })
  })

  describe('signOut', () => {
    it('로그아웃 성공', async () => {
      mockSignOut.mockResolvedValue({ error: null })

      const result = await signOut()
      expect(result.error).toBeNull()
    })
  })
})
