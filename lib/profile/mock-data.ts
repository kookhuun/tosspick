// @TASK P4-프로필 - 유저 프로필 Mock 데이터

export interface UserProfile {
  id: string
  nickname: string
  avatar_color: string
  bio?: string
  holdings_public: boolean
  followers_count: number
  following_count: number
  posts_count: number
  created_at: string
}

export interface UserHolding {
  symbol: string
  name: string
  quantity: number
  avg_price: number
  current_price: number
}

export const MOCK_PROFILES: Record<string, UserProfile> = {
  'user-1': {
    id: 'user-1',
    nickname: '투자고수김',
    avatar_color: '#3182F6',
    bio: '10년차 가치투자자',
    holdings_public: true,
    followers_count: 142,
    following_count: 38,
    posts_count: 27,
    created_at: '2024-01-15T00:00:00Z',
  },
  'user-2': {
    id: 'user-2',
    nickname: '주린이B',
    avatar_color: '#22c55e',
    bio: '주식 공부 중입니다',
    holdings_public: false,
    followers_count: 12,
    following_count: 24,
    posts_count: 8,
    created_at: '2025-03-01T00:00:00Z',
  },
  'user-3': {
    id: 'user-3',
    nickname: '장기투자자',
    avatar_color: '#f59e0b',
    bio: 'ETF 장기 투자 선호',
    holdings_public: true,
    followers_count: 89,
    following_count: 52,
    posts_count: 45,
    created_at: '2023-06-20T00:00:00Z',
  },
}

export const MOCK_HOLDINGS: Record<string, UserHolding[]> = {
  'user-1': [
    { symbol: '005930', name: '삼성전자', quantity: 100, avg_price: 68000, current_price: 75400 },
    { symbol: 'NVDA', name: 'NVIDIA', quantity: 10, avg_price: 650, current_price: 875 },
  ],
  'user-3': [
    { symbol: 'AAPL', name: 'Apple', quantity: 20, avg_price: 170, current_price: 187 },
    { symbol: '000660', name: 'SK하이닉스', quantity: 30, avg_price: 180000, current_price: 198000 },
  ],
}
