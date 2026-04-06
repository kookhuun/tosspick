// DB 없이도 사이트가 뜨도록 — Supabase 미연결 시 폴백 데이터
import type { NewsItem } from './news'
import type { MarketIndex, Sector, FearGreedData, BigMover, SectorGroup } from './market'
import type { TickerBasic } from './tickers'

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: '미 연준, 금리 동결 결정…시장 반응 주목',
    ai_headline: '연준 금리 동결, 하반기 인하 기대 유지',
    summary_one_line: '연준이 금리를 동결하며 하반기 인하 가능성을 열어뒀습니다.',
    impact_direction: 'positive',
    related_tickers: ['SPY', 'QQQ'],
    source_url: '#',
    published_at: new Date().toISOString(),
    image_url: null,
  },
  {
    id: '2',
    title: '삼성전자, 2분기 영업이익 전분기 대비 30% 증가 예상',
    ai_headline: '삼성전자 실적 개선 기대감 고조',
    summary_one_line: '반도체 업황 회복으로 삼성전자 실적이 큰 폭으로 개선될 전망입니다.',
    impact_direction: 'positive',
    related_tickers: ['005930'],
    source_url: '#',
    published_at: new Date(Date.now() - 3600000).toISOString(),
    image_url: null,
  },
  {
    id: '3',
    title: '원/달러 환율 1,380원대 등락…수출 기업 영향',
    ai_headline: '환율 변동성 확대, 수출주 주의',
    summary_one_line: '원화 약세 지속으로 수출 기업 수익성에 영향이 예상됩니다.',
    impact_direction: 'neutral',
    related_tickers: ['005935', '000660'],
    source_url: '#',
    published_at: new Date(Date.now() - 7200000).toISOString(),
    image_url: null,
  },
  {
    id: '4',
    title: 'AI 반도체 수요 급증…엔비디아 목표주가 상향',
    ai_headline: 'AI 수요 폭발로 반도체 섹터 강세',
    summary_one_line: 'AI 서버 수요 급증으로 반도체 관련주 강세가 이어지고 있습니다.',
    impact_direction: 'positive',
    related_tickers: ['NVDA', '000660'],
    source_url: '#',
    published_at: new Date(Date.now() - 10800000).toISOString(),
    image_url: null,
  },
  {
    id: '5',
    title: '카카오, 신규 AI 서비스 출시…주가 상승 출발',
    ai_headline: '카카오 AI 사업 본격화',
    summary_one_line: '카카오가 새로운 AI 기반 서비스를 발표하며 투자자 기대감을 높였습니다.',
    impact_direction: 'positive',
    related_tickers: ['035720'],
    source_url: '#',
    published_at: new Date(Date.now() - 14400000).toISOString(),
    image_url: null,
  },
  {
    id: '6',
    title: '中 경기 둔화 우려…국내 수출 지표 악화',
    ai_headline: '중국 리스크 재부각, 수출 관련주 약세',
    summary_one_line: '중국 경제 둔화가 국내 수출 의존 기업들에 부정적 영향을 미칠 수 있습니다.',
    impact_direction: 'negative',
    related_tickers: ['005930', '051910'],
    source_url: '#',
    published_at: new Date(Date.now() - 18000000).toISOString(),
    image_url: null,
  },
]

export const MOCK_DOMESTIC_INDICES: MarketIndex[] = [
  { name: 'KOSPI', current_value: 2650.45, change: 12.3, change_rate: 0.47 },
  { name: 'KOSDAQ', current_value: 865.22, change: -3.1, change_rate: -0.36 },
]

export const MOCK_OVERSEAS_INDICES: MarketIndex[] = [
  { name: 'S&P 500', current_value: 5234.18, change: 23.5, change_rate: 0.45 },
  { name: 'NASDAQ', current_value: 16420.3, change: 87.2, change_rate: 0.53 },
]

export const MOCK_SECTORS: Sector[] = [
  { id: '1', name: '반도체', change_rate: 2.3, color: '#22c55e' },
  { id: '2', name: 'IT·전자', change_rate: 1.1, color: '#86efac' },
  { id: '3', name: '자동차', change_rate: -0.8, color: '#fca5a5' },
  { id: '4', name: '금융', change_rate: 0.4, color: '#bbf7d0' },
  { id: '5', name: '바이오', change_rate: -1.5, color: '#ef4444' },
  { id: '6', name: '에너지', change_rate: 0.9, color: '#86efac' },
  { id: '7', name: '소비재', change_rate: -0.3, color: '#fde68a' },
  { id: '8', name: '화학', change_rate: 1.7, color: '#22c55e' },
]

export const MOCK_FEAR_GREED: FearGreedData = { score: 62, label: '탐욕' }

export const MOCK_BIG_MOVERS: BigMover[] = [
  { id: '1', symbol: '005930', name: '삼성전자', market: 'KOSPI', current_price: 75400, price_change: 1400, price_change_rate: 1.89 },
  { id: '2', symbol: 'NVDA', name: 'NVIDIA', market: 'NASDAQ', current_price: 875.4, price_change: 23.1, price_change_rate: 2.71 },
  { id: '3', symbol: '000660', name: 'SK하이닉스', market: 'KOSPI', current_price: 198000, price_change: 5000, price_change_rate: 2.59 },
  { id: '4', symbol: 'AAPL', name: 'Apple', market: 'NASDAQ', current_price: 187.3, price_change: -1.2, price_change_rate: -0.64 },
  { id: '5', symbol: '035720', name: '카카오', market: 'KOSPI', current_price: 52400, price_change: 2100, price_change_rate: 4.17 },
  { id: '6', symbol: 'TSLA', name: 'Tesla', market: 'NASDAQ', current_price: 178.5, price_change: -8.3, price_change_rate: -4.44 },
  { id: '7', symbol: '051910', name: 'LG화학', market: 'KOSPI', current_price: 315000, price_change: -8000, price_change_rate: -2.47 },
  { id: '8', symbol: 'META', name: 'Meta', market: 'NASDAQ', current_price: 507.2, price_change: 12.4, price_change_rate: 2.51 },
]

export const MOCK_POPULAR_TICKERS: TickerBasic[] = [
  { id: '1', symbol: '005930', name: '삼성전자', market: 'KOSPI', current_price: 75400, price_change_rate: 1.89 },
  { id: '2', symbol: '000660', name: 'SK하이닉스', market: 'KOSPI', current_price: 198000, price_change_rate: 2.59 },
  { id: '3', symbol: 'NVDA', name: 'NVIDIA', market: 'NASDAQ', current_price: 875.4, price_change_rate: 2.71 },
  { id: '4', symbol: 'AAPL', name: 'Apple', market: 'NASDAQ', current_price: 187.3, price_change_rate: -0.64 },
  { id: '5', symbol: '035720', name: '카카오', market: 'KOSPI', current_price: 52400, price_change_rate: 4.17 },
  { id: '6', symbol: 'TSLA', name: 'Tesla', market: 'NASDAQ', current_price: 178.5, price_change_rate: -4.44 },
  { id: '7', symbol: '051910', name: 'LG화학', market: 'KOSPI', current_price: 315000, price_change_rate: -2.47 },
  { id: '8', symbol: 'META', name: 'Meta', market: 'NASDAQ', current_price: 507.2, price_change_rate: 2.51 },
]

export const MOCK_OVERSEAS_SECTORS: SectorGroup[] = [
  {
    name: 'Technology',
    tickers: [
      { symbol: 'NVDA', name: 'NVIDIA', change_rate: 2.71, market_cap: 2200000000000 },
      { symbol: 'AAPL', name: 'Apple', change_rate: -0.64, market_cap: 2900000000000 },
      { symbol: 'META', name: 'Meta', change_rate: 2.51, market_cap: 1300000000000 },
      { symbol: 'MSFT', name: 'Microsoft', change_rate: 0.83, market_cap: 3100000000000 },
    ],
  },
  {
    name: 'Consumer',
    tickers: [
      { symbol: 'TSLA', name: 'Tesla', change_rate: -4.44, market_cap: 570000000000 },
      { symbol: 'AMZN', name: 'Amazon', change_rate: 1.2, market_cap: 1900000000000 },
    ],
  },
  {
    name: 'Finance',
    tickers: [
      { symbol: 'JPM', name: 'JPMorgan', change_rate: 0.55, market_cap: 580000000000 },
      { symbol: 'GS', name: 'Goldman Sachs', change_rate: -0.3, market_cap: 150000000000 },
    ],
  },
]
