// @TASK P4-커뮤니티 - Mock 데이터 (DB 없을 때 폴백)

export type PostCategory = 'general' | 'question' | 'bullish' | 'bearish'

export interface PostAuthor {
  nickname: string
}

export interface Post {
  id: string
  title: string
  content: string
  category: PostCategory
  like_count: number
  dislike_count: number
  comment_count: number
  created_at: string
  author: PostAuthor
  ticker_id: string
}

export interface Comment {
  id: string
  content: string
  like_count: number
  created_at: string
  author: PostAuthor
  parent_comment_id: string | null
  replies: Comment[]
}

const now = Date.now()

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: '오늘 실적 발표 어떻게 보시나요?',
    content:
      '어닝 시즌인데 컨센서스 대비 어떻게 나올지 궁금합니다. 개인적으로는 AI 수요가 워낙 강해서 긍정적으로 봅니다. 지난 분기보다 EPS가 개선될 것 같고요.',
    category: 'question',
    like_count: 24,
    dislike_count: 2,
    comment_count: 8,
    created_at: new Date(now - 600_000).toISOString(),
    author: { nickname: '투자고수김' },
    ticker_id: 'AAPL',
  },
  {
    id: '2',
    title: '신규 AI 칩 라인업 발표 호재입니다',
    content:
      '방금 발표된 내용 보셨나요? 차세대 칩 성능이 전작 대비 40% 이상 향상됐다고 합니다. 데이터센터 수요 폭증 중인데 타이밍이 완벽합니다.',
    category: 'bullish',
    like_count: 41,
    dislike_count: 3,
    comment_count: 15,
    created_at: new Date(now - 1_800_000).toISOString(),
    author: { nickname: '반도체덕후' },
    ticker_id: 'AAPL',
  },
  {
    id: '3',
    title: '주가 너무 올랐습니다. 고평가 구간',
    content:
      'PER 기준으로 보면 역대 최고 수준입니다. 실적이 좋아도 주가가 이미 반영한 것 같아서 단기 조정이 올 수 있다고 봅니다.',
    category: 'bearish',
    like_count: 18,
    dislike_count: 12,
    comment_count: 22,
    created_at: new Date(now - 3_600_000).toISOString(),
    author: { nickname: '가치투자자박' },
    ticker_id: 'AAPL',
  },
  {
    id: '4',
    title: '장기 보유 전략 공유합니다',
    content:
      '3년째 보유 중인데 배당 재투자 포함하면 수익률이 꽤 됩니다. 단기 등락에 흔들리지 말고 기업 펀더멘털을 보세요.',
    category: 'general',
    like_count: 55,
    dislike_count: 1,
    comment_count: 11,
    created_at: new Date(now - 7_200_000).toISOString(),
    author: { nickname: '워렌을꿈꾸며' },
    ticker_id: 'AAPL',
  },
  {
    id: '5',
    title: '환율 영향 어떻게 보시나요?',
    content:
      '달러 강세가 지속되면 해외 매출 비중 높은 기업들 실적에 영향이 있을 것 같습니다. 환헤지 전략을 쓰는지 IR 자료 찾아봤는데 없더라고요.',
    category: 'question',
    like_count: 9,
    dislike_count: 0,
    comment_count: 4,
    created_at: new Date(now - 14_400_000).toISOString(),
    author: { nickname: '이코노미스트최' },
    ticker_id: 'AAPL',
  },
]

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    content: '저도 긍정적으로 보고 있어요. AI 관련 수요가 계속 늘고 있으니까요.',
    like_count: 5,
    created_at: new Date(now - 300_000).toISOString(),
    author: { nickname: '장기투자자' },
    parent_comment_id: null,
    replies: [
      {
        id: 'c2',
        content: '동의합니다. 근데 주가 이미 많이 올랐으니 조심도 필요하죠.',
        like_count: 2,
        created_at: new Date(now - 240_000).toISOString(),
        author: { nickname: '신중론자' },
        parent_comment_id: 'c1',
        replies: [],
      },
    ],
  },
  {
    id: 'c3',
    content: '컨센서스 EPS가 얼마인지 아시는 분 계세요?',
    like_count: 3,
    created_at: new Date(now - 180_000).toISOString(),
    author: { nickname: '초보투자자정' },
    parent_comment_id: null,
    replies: [
      {
        id: 'c4',
        content: '지난 분기 대비 8% 상향 전망입니다. 블룸버그 컨센서스 기준이요.',
        like_count: 7,
        created_at: new Date(now - 120_000).toISOString(),
        author: { nickname: '애널리스트김' },
        parent_comment_id: 'c3',
        replies: [],
      },
    ],
  },
  {
    id: 'c5',
    content: '저는 이미 일부 익절했습니다. 리스크 관리 차원에서요.',
    like_count: 4,
    created_at: new Date(now - 60_000).toISOString(),
    author: { nickname: '리스크헤저' },
    parent_comment_id: null,
    replies: [],
  },
]
