import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PriceBadge from '@/components/ui/PriceBadge'
import ImpactBadge from '@/components/ui/ImpactBadge'
import TickerTag from '@/components/ui/TickerTag'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('PriceBadge', () => {
  it('양수 변동률 → 초록 클래스', () => {
    const { container } = render(<PriceBadge changeRate={2.5} />)
    expect(container.firstChild?.toString()).not.toBe('')
    expect(screen.getByText(/2\.5/)).toBeDefined()
  })

  it('음수 변동률 → 빨강 클래스', () => {
    render(<PriceBadge changeRate={-1.3} />)
    expect(screen.getByText(/-1\.3/)).toBeDefined()
  })

  it('0 변동률 → 회색 클래스', () => {
    render(<PriceBadge changeRate={0} />)
    expect(screen.getByText(/0\.00/)).toBeDefined()
  })
})

describe('ImpactBadge', () => {
  it('positive → 긍정 표시', () => {
    render(<ImpactBadge direction="positive" />)
    expect(screen.getByText('긍정')).toBeDefined()
  })

  it('negative → 부정 표시', () => {
    render(<ImpactBadge direction="negative" />)
    expect(screen.getByText('부정')).toBeDefined()
  })

  it('neutral → 중립 표시', () => {
    render(<ImpactBadge direction="neutral" />)
    expect(screen.getByText('중립')).toBeDefined()
  })
})

describe('TickerTag', () => {
  it('symbol과 name을 표시하고 올바른 링크를 가진다', () => {
    render(<TickerTag symbol="005930" name="삼성전자" />)
    expect(screen.getByText('삼성전자')).toBeDefined()
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/stock/005930')
  })
})
