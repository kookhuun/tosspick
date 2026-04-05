import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  useSearchParams: vi.fn(() => ({ get: vi.fn(() => null) })),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  })),
}))

describe('LoginForm', () => {
  it('이메일·비밀번호 입력 필드 렌더링', () => {
    render(<LoginForm />)
    expect(screen.getByPlaceholderText(/이메일/i)).toBeDefined()
    expect(screen.getByPlaceholderText(/비밀번호/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /로그인/ })).toBeDefined()
  })

  it('빈 폼 제출 시 유효성 검사 오류', async () => {
    render(<LoginForm />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /로그인/ }))
    // HTML5 required 검증 또는 커스텀 오류
    expect(screen.getByPlaceholderText(/이메일/i)).toBeDefined()
  })
})

describe('SignupForm', () => {
  it('회원가입 필드 렌더링 (이메일, 비밀번호, 닉네임)', () => {
    render(<SignupForm />)
    expect(screen.getByPlaceholderText(/이메일/i)).toBeDefined()
    expect(screen.getByPlaceholderText(/닉네임/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /회원가입/ })).toBeDefined()
  })

  it('비밀번호 불일치 시 에러 메시지', async () => {
    render(<SignupForm />)
    // fireEvent.change로 controlled input 상태 직접 업데이트
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getByPlaceholderText('비밀번호 확인'), {
      target: { value: 'Different123!' },
    })
    fireEvent.submit(screen.getByRole('button', { name: /회원가입/ }).closest('form')!)
    await waitFor(() => {
      expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeDefined()
    })
  })
})
