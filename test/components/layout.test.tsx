import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BottomTabBar from '@/components/layout/BottomTabBar'

// Next.js navigation mock
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('BottomTabBar', () => {
  it('5개 탭을 렌더링한다', () => {
    render(<BottomTabBar />)
    expect(screen.getByText('홈')).toBeDefined()
    expect(screen.getByText('시장')).toBeDefined()
    expect(screen.getByText('검색')).toBeDefined()
    expect(screen.getByText('학습')).toBeDefined()
    expect(screen.getByText('마이')).toBeDefined()
  })

  it('현재 경로(/)에 해당하는 홈 탭이 활성화된다', () => {
    render(<BottomTabBar />)
    const homeLink = screen.getByText('홈').closest('a')
    expect(homeLink?.getAttribute('href')).toBe('/')
  })
})
