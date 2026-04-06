// @TASK P2-S1-T1 - 홈 화면 테스트
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

// Mock fetch for API calls
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const mockNewsItems = [
  {
    id: 1,
    title: '삼성전자 실적 호조',
    ai_headline: '삼성전자, 영업이익 10조 돌파',
    summary_one_line: '3분기 영업이익 10조 달성',
    impact_direction: 'positive' as const,
    related_tickers: ['005930'],
    source_url: 'https://example.com/1',
    published_at: '2026-04-05T10:00:00Z',
    image_url: null,
  },
  {
    id: 2,
    title: 'KOSPI 하락',
    ai_headline: '외국인 매도에 코스피 1% 급락',
    summary_one_line: '외국인 매도로 1% 하락',
    impact_direction: 'negative' as const,
    related_tickers: [],
    source_url: 'https://example.com/2',
    published_at: '2026-04-05T09:00:00Z',
    image_url: null,
  },
]

describe('NewsCard', () => {
  it('뉴스 카드에 title, summary_one_line, impact_direction 배지가 표시된다', async () => {
    const { default: NewsCard } = await import('@/components/news/NewsCard')
    render(<NewsCard item={mockNewsItems[0]} />)

    expect(screen.getByText('삼성전자 실적 호조')).toBeInTheDocument()
    expect(screen.getByText('3분기 영업이익 10조 달성')).toBeInTheDocument()
    expect(screen.getByText('긍정')).toBeInTheDocument()
  })

  it('카드 전체가 원문 링크로 연결된다', async () => {
    const { default: NewsCard } = await import('@/components/news/NewsCard')
    render(<NewsCard item={mockNewsItems[0]} />)

    const headline = screen.getByText('삼성전자, 영업이익 10조 돌파')
    const link = headline.closest('a')
    expect(link).toHaveAttribute('href', 'https://example.com/1')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('관련 종목 코드가 표시된다', async () => {
    const { default: NewsCard } = await import('@/components/news/NewsCard')
    render(<NewsCard item={mockNewsItems[0]} />)

    expect(screen.getByText('005930')).toBeInTheDocument()
  })
})

describe('NewsCardList', () => {
  it('뉴스 카드 목록을 렌더링한다', async () => {
    const { default: NewsCardList } = await import('@/components/news/NewsCardList')
    render(<NewsCardList items={mockNewsItems} />)

    expect(screen.getByText('삼성전자 실적 호조')).toBeInTheDocument()
    expect(screen.getByText('KOSPI 하락')).toBeInTheDocument()
  })

  it('빈 목록이면 EmptyState를 표시한다', async () => {
    const { default: NewsCardList } = await import('@/components/news/NewsCardList')
    render(<NewsCardList items={[]} />)

    expect(screen.getByText(/뉴스가 없습니다/)).toBeInTheDocument()
  })
})

describe('LoginNudgeBanner', () => {
  it('비인증 상태일 때 배너가 표시된다', async () => {
    const { default: LoginNudgeBanner } = await import('@/components/home/LoginNudgeBanner')
    render(<LoginNudgeBanner isAuthenticated={false} />)

    expect(screen.getByText(/맞춤 뉴스를 받으세요/)).toBeInTheDocument()
  })

  it('인증 상태일 때 배너가 표시되지 않는다', async () => {
    const { default: LoginNudgeBanner } = await import('@/components/home/LoginNudgeBanner')
    render(<LoginNudgeBanner isAuthenticated={true} />)

    expect(screen.queryByText(/맞춤 뉴스를 받으세요/)).not.toBeInTheDocument()
  })
})
