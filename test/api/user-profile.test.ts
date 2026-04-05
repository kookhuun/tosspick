import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetUser = vi.fn()
const mockSelect = vi.fn()
const mockUpdate = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: vi.fn(() => ({
      select: mockSelect.mockReturnThis(),
      update: mockUpdate.mockReturnThis(),
      eq: mockEq.mockReturnThis(),
      single: mockSingle,
    })),
  })),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ getAll: vi.fn(() => []), set: vi.fn() })),
}))

import { getProfile, updateProfile } from '@/lib/user-profile'

describe('lib/user-profile.ts', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('getProfile', () => {
    it('인증된 사용자 프로필 반환', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
      mockSingle.mockResolvedValue({ data: { id: 'u1', nickname: '테스터', avatar_url: null }, error: null })

      const result = await getProfile()
      expect(result.data?.nickname).toBe('테스터')
    })

    it('미인증 시 null 반환', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } })

      const result = await getProfile()
      expect(result.data).toBeNull()
    })
  })

  describe('updateProfile', () => {
    it('닉네임 수정 성공', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
      mockSingle.mockResolvedValue({ data: { id: 'u1', nickname: '새닉네임' }, error: null })

      const result = await updateProfile({ nickname: '새닉네임' })
      expect(result.data?.nickname).toBe('새닉네임')
    })
  })
})
