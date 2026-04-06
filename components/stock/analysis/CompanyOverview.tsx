// @TASK P4-회사분석 - 회사 현황 카드
// mock 데이터 기반 (외부 DB 없이 symbol별 분기)

interface CompanyOverviewProps {
  symbol: string
  marketCap?: number
  volume?: number
}

interface CompanyMock {
  description: string
  sectors: string[]
  industry: string
  high52w: string
  low52w: string
}

const COMPANY_DATA: Record<string, CompanyMock> = {
  NVDA: {
    description: 'AI 반도체 선도 기업. 데이터센터·게이밍·자율주행 GPU 공급',
    sectors: ['AI', '반도체', '데이터센터', '게이밍'],
    industry: '반도체',
    high52w: '$974',
    low52w: '$462',
  },
  AAPL: {
    description: '스마트폰·PC·웨어러블 생태계 기반의 소비자 기술 기업',
    sectors: ['스마트폰', '생태계', '서비스', '웨어러블'],
    industry: '소비자 기술',
    high52w: '$237',
    low52w: '$164',
  },
  MSFT: {
    description: '클라우드(Azure) 및 생산성 소프트웨어 글로벌 1위 기업',
    sectors: ['클라우드', 'AI', '엔터프라이즈', '게이밍'],
    industry: '소프트웨어',
    high52w: '$468',
    low52w: '$344',
  },
  TSLA: {
    description: '전기차·에너지 스토리지·자율주행 소프트웨어 선도 기업',
    sectors: ['전기차', '자율주행', '에너지', 'AI'],
    industry: '자동차',
    high52w: '$488',
    low52w: '$138',
  },
  '005930': {
    description: '반도체·스마트폰·가전 글로벌 1위 종합 전자 기업',
    sectors: ['반도체', '스마트폰', '가전', 'OLED'],
    industry: '반도체/전자',
    high52w: '89,200원',
    low52w: '48,800원',
  },
  '000660': {
    description: 'D램·낸드 플래시 메모리 반도체 전문 기업',
    sectors: ['메모리반도체', 'D램', '낸드', 'AI서버'],
    industry: '반도체',
    high52w: '254,000원',
    low52w: '132,000원',
  },
}

const DEFAULT_COMPANY: CompanyMock = {
  description: '글로벌 주요 시장에 상장된 기업입니다.',
  sectors: ['주식'],
  industry: '기타',
  high52w: '-',
  low52w: '-',
}

function formatMarketCap(value?: number): string {
  if (!value) return '-'
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}조`
  if (value >= 1e8) return `${(value / 1e8).toFixed(0)}억`
  return value.toLocaleString()
}

export default function CompanyOverview({ symbol, marketCap, volume }: CompanyOverviewProps) {
  const data = COMPANY_DATA[symbol] ?? DEFAULT_COMPANY

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">회사 현황</h3>

      {/* 한 줄 소개 */}
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{data.description}</p>

      {/* 주요 사업 배지 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {data.sectors.map((sector) => (
          <span
            key={sector}
            className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100"
          >
            {sector}
          </span>
        ))}
      </div>

      {/* 수치 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">업종</span>
          <span className="text-sm font-semibold text-gray-900">{data.industry}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">시가총액</span>
          <span className="text-sm font-semibold text-gray-900">{formatMarketCap(marketCap)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">52주 최고</span>
          <span className="text-sm font-semibold text-green-600">{data.high52w}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">52주 최저</span>
          <span className="text-sm font-semibold text-red-500">{data.low52w}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">거래량</span>
          <span className="text-sm font-semibold text-gray-900">
            {volume ? volume.toLocaleString() : '-'}
          </span>
        </div>
      </div>
    </div>
  )
}
