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

// 전체 커뮤니티 피드용 — 종목명 포함
export interface GlobalPost extends Post {
  ticker_name: string
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

// 전체 커뮤니티 피드용 mock — 여러 종목 혼합 (DB 연결 시 API 교체)
export const MOCK_GLOBAL_POSTS: GlobalPost[] = [
  {
    id: 'g1',
    ticker_id: 'NVDA',
    ticker_name: 'NVIDIA',
    title: '신규 AI 칩 라인업 발표 호재입니다',
    content: '차세대 Blackwell 아키텍처 기반 칩이 예상보다 빠르게 출시됩니다. 데이터센터 수요 폭증과 맞물려 긍정적입니다.',
    category: 'bullish',
    like_count: 41,
    dislike_count: 3,
    comment_count: 15,
    created_at: new Date(now - 2 * 60_000).toISOString(),
    author: { nickname: '반도체덕후' },
  },
  {
    id: 'g2',
    ticker_id: '005930',
    ticker_name: '삼성전자',
    title: '오늘 실적 발표 어떻게 보시나요?',
    content: 'HBM3E 공급 확대 기대감이 있지만 메모리 가격 하락이 변수입니다. 컨센서스 대비 어떻게 나올지 궁금합니다.',
    category: 'question',
    like_count: 24,
    dislike_count: 2,
    comment_count: 8,
    created_at: new Date(now - 5 * 60_000).toISOString(),
    author: { nickname: '투자고수김' },
  },
  {
    id: 'g3',
    ticker_id: 'AAPL',
    ticker_name: 'Apple',
    title: 'iPhone 16e 판매량 기대 이하라는 분석 나왔네요',
    content: '에이전트 관련 AI 기능이 시장 기대치를 충족 못했다는 평가가 많습니다. 단기 조정 가능성 있어 보입니다.',
    category: 'bearish',
    like_count: 18,
    dislike_count: 5,
    comment_count: 22,
    created_at: new Date(now - 12 * 60_000).toISOString(),
    author: { nickname: '가치투자자박' },
  },
  {
    id: 'g4',
    ticker_id: 'TSLA',
    ticker_name: 'Tesla',
    title: '사이버트럭 리콜 이슈 실제로 얼마나 심각한가요?',
    content: '리콜 규모가 예상보다 커졌는데 브랜드 이미지 타격이 걱정됩니다. 장기적으로는 어떻게 보시나요?',
    category: 'question',
    like_count: 9,
    dislike_count: 1,
    comment_count: 14,
    created_at: new Date(now - 18 * 60_000).toISOString(),
    author: { nickname: '전기차러버' },
  },
  {
    id: 'g5',
    ticker_id: 'MSFT',
    ticker_name: 'Microsoft',
    title: 'Azure AI 성장률 계속 가속 중입니다',
    content: 'OpenAI와의 파트너십 효과가 클라우드 부문에서 확실히 나타나고 있습니다. 올해 목표가 상향 가능성 높아 보입니다.',
    category: 'bullish',
    like_count: 55,
    dislike_count: 1,
    comment_count: 11,
    created_at: new Date(now - 25 * 60_000).toISOString(),
    author: { nickname: '클라우드전도사' },
  },
  {
    id: 'g6',
    ticker_id: '035420',
    ticker_name: 'NAVER',
    title: '하이퍼클로바X 기업 고객 확대 소식',
    content: '국내 대기업들의 사내 AI 도입 수요가 늘면서 B2B 매출이 늘고 있다는 IR 자료가 나왔습니다.',
    category: 'bullish',
    like_count: 31,
    dislike_count: 4,
    comment_count: 7,
    created_at: new Date(now - 40 * 60_000).toISOString(),
    author: { nickname: '국내주식러' },
  },
  {
    id: 'g7',
    ticker_id: 'AMZN',
    ticker_name: 'Amazon',
    title: '주식 분할 가능성 있다고 보시나요?',
    content: '주가가 많이 올라서 분할 얘기가 나오는데 실제로 가능성이 있을까요? 과거 사례들 보면 어떤 영향이 있었나요.',
    category: 'question',
    like_count: 12,
    dislike_count: 0,
    comment_count: 6,
    created_at: new Date(now - 55 * 60_000).toISOString(),
    author: { nickname: '주린이최' },
  },
  {
    id: 'g8',
    ticker_id: 'NVDA',
    ticker_name: 'NVIDIA',
    title: 'PER 기준으로 보면 여전히 고평가 구간 아닌가요?',
    content: '성장률을 감안해도 현재 밸류에이션이 부담스럽습니다. 단기 트레이더분들은 어떻게 대응하고 계신가요?',
    category: 'bearish',
    like_count: 22,
    dislike_count: 8,
    comment_count: 19,
    created_at: new Date(now - 80 * 60_000).toISOString(),
    author: { nickname: '밸류투자자정' },
  },
  {
    id: 'g9',
    ticker_id: '000660',
    ticker_name: 'SK하이닉스',
    title: 'HBM4 양산 일정 앞당겨진다는 소식',
    content: 'NVIDIA B300 시리즈 대응 물량 확보를 위해 생산라인 전환을 서두르고 있다는 업계 관계자 발언이 있었습니다.',
    category: 'bullish',
    like_count: 48,
    dislike_count: 2,
    comment_count: 13,
    created_at: new Date(now - 2 * 3_600_000).toISOString(),
    author: { nickname: '반도체분석가' },
  },
  {
    id: 'g10',
    ticker_id: 'GOOGL',
    ticker_name: 'Alphabet',
    title: '유튜브 광고 매출 성장세 회복 신호',
    content: '작년 대비 디지털 광고 시장이 회복되면서 유튜브 매출 증가율이 개선될 것으로 봅니다. 검색 광고도 여전히 견조합니다.',
    category: 'general',
    like_count: 17,
    dislike_count: 3,
    comment_count: 5,
    created_at: new Date(now - 3 * 3_600_000).toISOString(),
    author: { nickname: '광고산업분석' },
  },
]
