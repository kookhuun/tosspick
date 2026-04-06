// @TASK P2-S2-T1 - 시장 대시보드 화면 테스트
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

const mockIndices = [
  { name: 'KOSPI', current_value: 2500.5, change: 10.5, change_rate: 0.42 },
  { name: 'KOSDAQ', current_value: 850.2, change: -3.1, change_rate: -0.36 },
  { name: 'S&P500', current_value: 5200.0, change: 25.0, change_rate: 0.48 },
  { name: 'NASDAQ', current_value: 16800.0, change: -50.0, change_rate: -0.3 },
]

const mockSectors = [
  { id: 1, name: '반도체', change_rate: 3.5, color: 'bg-green-600' },
  { id: 2, name: '자동차', change_rate: -1.5, color: 'bg-red-400' },
]

const mockFearGreed = { score: 42, label: 'fear' }

const mockGainers = [
  { id: 1, symbol: '005930', name: '삼성전자', price_change_rate: 4.35 },
]

const mockLosers = [
  { id: 2, symbol: '035720', name: '카카오', price_change_rate: -3.5 },
]

describe('IndexCard', () => {
  it('지수 이름, 현재값, 등락률을 표시한다', async () => {
    const { default: IndexCard } = await import('@/components/market/IndexCard')
    render(<IndexCard index={mockIndices[0]} />)

    expect(screen.getByText('KOSPI')).toBeInTheDocument()
    expect(screen.getByText(/2[,.]?500/)).toBeInTheDocument()
    expect(screen.getByText(/0\.42/)).toBeInTheDocument()
  })

  it('하락 시 빨간색 클래스를 적용한다', async () => {
    const { default: IndexCard } = await import('@/components/market/IndexCard')
    const { container } = render(<IndexCard index={mockIndices[1]} />)

    expect(container.querySelector('.text-red-500, .text-red-600')).toBeInTheDocument()
  })
})

describe('SectorHeatmap', () => {
  it('섹터 목록을 렌더링한다', async () => {
    const { default: SectorHeatmap } = await import('@/components/market/SectorHeatmap')
    render(<SectorHeatmap sectors={mockSectors} />)

    expect(screen.getByText('반도체')).toBeInTheDocument()
    expect(screen.getByText('자동차')).toBeInTheDocument()
  })
})

describe('FearGreedGauge', () => {
  it('점수와 레이블을 표시한다', async () => {
    const { default: FearGreedGauge } = await import('@/components/market/FearGreedGauge')
    render(<FearGreedGauge data={mockFearGreed} />)

    expect(screen.getByText('42')).toBeInTheDocument()
    // 레이블 텍스트만 확인 (타이틀 "공포탐욕 지수"와 구분)
    expect(screen.getByText('공포')).toBeInTheDocument()
  })
})

describe('TopMovers', () => {
  it('상승 종목 탭을 기본으로 표시한다', async () => {
    const { default: TopMovers } = await import('@/components/market/TopMovers')
    render(<TopMovers gainers={mockGainers} losers={mockLosers} />)

    expect(screen.getByText('삼성전자')).toBeInTheDocument()
  })

  it('하락 탭 클릭 시 하락 종목을 표시한다', async () => {
    const user = userEvent.setup()
    const { default: TopMovers } = await import('@/components/market/TopMovers')
    render(<TopMovers gainers={mockGainers} losers={mockLosers} />)

    await user.click(screen.getByText('하락'))
    expect(screen.getByText('카카오')).toBeInTheDocument()
  })

  it('종목 클릭 시 /stock/[symbol]로 이동한다', async () => {
    const { default: TopMovers } = await import('@/components/market/TopMovers')
    render(<TopMovers gainers={mockGainers} losers={mockLosers} />)

    const link = screen.getByText('삼성전자').closest('a')
    expect(link).toHaveAttribute('href', '/stock/005930')
  })
})
