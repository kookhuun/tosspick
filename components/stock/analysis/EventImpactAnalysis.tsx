// @TASK P4-회사분석 - 이벤트 → 주가 영향 인과 분석 (핵심 차별화 기능)
// mock 데이터 기반, symbol별 이벤트 하드코딩

export type ImpactLevel = 'strong' | 'moderate' | 'weak'
export type ImpactDirection = 'positive' | 'negative' | 'neutral'
export type OpinionType = 'buy_consider' | 'caution' | 'hold'
export type EventType = 'earnings' | 'news' | 'macro' | 'risk'

interface EventItem {
  id: string
  type: EventType
  title: string
  body: string
  causalChain: string
  impactLevel: ImpactLevel
  impactDirection: ImpactDirection
  date: string
}

interface SymbolAnalysis {
  events: EventItem[]
  opinion: OpinionType
  opinionSummary: string
}

// ── mock 데이터 ──────────────────────────────────────────────
const ANALYSIS_DATA: Record<string, SymbolAnalysis> = {
  NVDA: {
    events: [
      {
        id: 'nvda-1',
        type: 'earnings',
        title: '실적 발표 (2026-04-06)',
        body: '매출 $44.1B (+12% YoY) — 예상치 $43.2B 상회',
        causalChain:
          '예상치를 웃도는 실적 → 기관 매수 증가 예상 → 단기 주가 상승 압력',
        impactLevel: 'strong',
        impactDirection: 'positive',
        date: '2026-04-06',
      },
      {
        id: 'nvda-2',
        type: 'news',
        title: '주요 뉴스 영향',
        body: '"AI 수요 급증으로 데이터센터 투자 확대 전망"',
        causalChain:
          'AI 칩 수요 증가 → 매출 성장 기대감 강화 → 주가 상승 요인',
        impactLevel: 'moderate',
        impactDirection: 'positive',
        date: '2026-04-05',
      },
      {
        id: 'nvda-3',
        type: 'macro',
        title: '미중 수출 규제 리스크',
        body: '미 상무부, 중국향 H20 칩 추가 제한 검토 보도',
        causalChain:
          '중국 수출 감소 가능성 → 데이터센터 매출 일부 타격 → 단기 불확실성',
        impactLevel: 'moderate',
        impactDirection: 'negative',
        date: '2026-04-04',
      },
    ],
    opinion: 'buy_consider',
    opinionSummary:
      '강력한 AI 수요와 예상치 초과 실적을 감안하면 중장기 성장 스토리는 유효합니다. 다만 중국 수출 규제 이슈가 단기 변동성을 높일 수 있어 분할 매수 접근이 유리합니다.',
  },
  AAPL: {
    events: [
      {
        id: 'aapl-1',
        type: 'earnings',
        title: '2분기 실적 발표 (2026-04-06)',
        body: '아이폰 판매 $53.3B — 예상치와 부합',
        causalChain:
          '예상 수준 실적 → 큰 서프라이즈 없음 → 주가 보합 예상',
        impactLevel: 'weak',
        impactDirection: 'neutral',
        date: '2026-04-06',
      },
      {
        id: 'aapl-2',
        type: 'news',
        title: 'Apple Intelligence 확장 발표',
        body: '"iOS 19에 온디바이스 AI 기능 대폭 강화"',
        causalChain:
          'AI 기능 강화 → 기기 교체 사이클 자극 → 아이폰 판매 반등 기대',
        impactLevel: 'moderate',
        impactDirection: 'positive',
        date: '2026-04-03',
      },
    ],
    opinion: 'hold',
    opinionSummary:
      '실적은 안정적이나 성장 모멘텀이 제한적입니다. Apple Intelligence 확산에 따른 교체 수요가 하반기 실적의 관건이며, 현 주가 수준에서는 보유 전략이 적합합니다.',
  },
  '005930': {
    events: [
      {
        id: 'sam-1',
        type: 'earnings',
        title: '1분기 잠정 실적 (2026-04-06)',
        body: '영업이익 6.6조원 (+40% QoQ) — 반도체 부문 회복세',
        causalChain:
          'HBM 공급 확대 + 메모리 가격 반등 → 영업이익 급회복 → 주가 재평가 가능성',
        impactLevel: 'strong',
        impactDirection: 'positive',
        date: '2026-04-06',
      },
      {
        id: 'sam-2',
        type: 'risk',
        title: '환율 리스크',
        body: '원/달러 1,380원대 지속 — 해외 매출 환산 이익 증가',
        causalChain:
          '달러 강세 → 반도체 수출 원화 환산 매출 증가 → 실적 긍정 요인',
        impactLevel: 'moderate',
        impactDirection: 'positive',
        date: '2026-04-05',
      },
    ],
    opinion: 'buy_consider',
    opinionSummary:
      'HBM3E 양산 확대와 메모리 가격 반등이 맞물리며 실적 회복 구간에 진입했습니다. 중장기 AI 메모리 수요 수혜주로 분할 매수를 고려할 만합니다.',
  },
  '000660': {
    events: [
      {
        id: 'hynix-1',
        type: 'earnings',
        title: '1분기 실적 기대',
        body: 'HBM3E 16단 독점 공급 — 엔비디아 H200 탑재',
        causalChain:
          '독점 공급 구조 → 초과 수익 마진 확보 → 영업이익률 급상승 기대',
        impactLevel: 'strong',
        impactDirection: 'positive',
        date: '2026-04-06',
      },
      {
        id: 'hynix-2',
        type: 'news',
        title: '차세대 HBM4 개발 발표',
        body: '"2026년 하반기 HBM4 양산 목표 확인"',
        causalChain:
          '기술 리더십 확인 → 경쟁사 대비 프리미엄 유지 → 주가 프리미엄 지속',
        impactLevel: 'moderate',
        impactDirection: 'positive',
        date: '2026-04-04',
      },
    ],
    opinion: 'buy_consider',
    opinionSummary:
      'HBM 시장 독점적 지위와 엔비디아 공급망 핵심 역할이 지속됩니다. AI 인프라 투자 사이클 내내 수혜가 예상되며 중장기 매수 관점이 유효합니다.',
  },
}

const DEFAULT_ANALYSIS: SymbolAnalysis = {
  events: [
    {
      id: 'default-1',
      type: 'news',
      title: '최근 주요 뉴스',
      body: '시장 전반의 거시경제 변화에 영향을 받고 있습니다.',
      causalChain: '금리·환율 변동 → 전체 시장 밸류에이션 조정 → 주가 연동',
      impactLevel: 'weak',
      impactDirection: 'neutral',
      date: '2026-04-06',
    },
  ],
  opinion: 'hold',
  opinionSummary:
    '충분한 분석 데이터가 쌓이기 전까지는 보수적 접근을 권장합니다. 추가 실적 발표 후 재평가가 필요합니다.',
}

// ── 헬퍼 ────────────────────────────────────────────────────
const EVENT_ICON: Record<EventType, string> = {
  earnings: '📊',
  news: '📰',
  macro: '🌐',
  risk: '⚠️',
}

const IMPACT_BAR_WIDTH: Record<ImpactLevel, number> = {
  strong: 80,
  moderate: 55,
  weak: 30,
}

const IMPACT_BAR_COLOR: Record<ImpactDirection, string> = {
  positive: 'bg-green-400',
  negative: 'bg-red-400',
  neutral: 'bg-gray-300',
}

const IMPACT_TEXT: Record<ImpactLevel, string> = {
  strong: '강함',
  moderate: '보통',
  weak: '약함',
}

const IMPACT_LABEL_COLOR: Record<ImpactDirection, string> = {
  positive: 'text-green-600',
  negative: 'text-red-500',
  neutral: 'text-gray-500',
}

const DIRECTION_LABEL: Record<ImpactDirection, string> = {
  positive: '긍정',
  negative: '부정',
  neutral: '중립',
}

const OPINION_STYLE: Record<
  OpinionType,
  { label: string; className: string; badge: string }
> = {
  buy_consider: {
    label: '매수 고려',
    className: 'bg-green-50 border-green-100',
    badge: 'bg-green-100 text-green-700',
  },
  caution: {
    label: '주의',
    className: 'bg-red-50 border-red-100',
    badge: 'bg-red-100 text-red-600',
  },
  hold: {
    label: '보유',
    className: 'bg-yellow-50 border-yellow-100',
    badge: 'bg-yellow-100 text-yellow-700',
  },
}

// ── 이벤트 카드 ─────────────────────────────────────────────
function EventCard({ event }: { event: EventItem }) {
  const barWidth = IMPACT_BAR_WIDTH[event.impactLevel]
  const barColor = IMPACT_BAR_COLOR[event.impactDirection]
  const labelColor = IMPACT_LABEL_COLOR[event.impactDirection]

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true">{EVENT_ICON[event.type]}</span>
          <span className="text-sm font-semibold text-gray-800">{event.title}</span>
        </div>
        <span className="text-[10px] text-gray-400 shrink-0">{event.date}</span>
      </div>

      {/* 본문 */}
      <p className="text-sm text-gray-700 mb-3 leading-relaxed">{event.body}</p>

      {/* 인과관계 설명 */}
      <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-medium text-gray-700">인과관계</span>{' '}
          {event.causalChain}
        </p>
      </div>

      {/* 영향도 바 */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-400 shrink-0">영향도</span>
        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full ${barColor} transition-all duration-500`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <span className={`text-[10px] font-semibold shrink-0 ${labelColor}`}>
          {IMPACT_TEXT[event.impactLevel]} ({DIRECTION_LABEL[event.impactDirection]})
        </span>
      </div>
    </div>
  )
}

// ── 메인 컴포넌트 ────────────────────────────────────────────
export default function EventImpactAnalysis({ symbol }: { symbol: string }) {
  const data = ANALYSIS_DATA[symbol] ?? DEFAULT_ANALYSIS
  const opinionStyle = OPINION_STYLE[data.opinion]

  return (
    <div className="flex flex-col gap-3">
      {/* 섹션 제목 */}
      <div className="px-1">
        <h3 className="text-sm font-semibold text-gray-700">오늘의 이벤트 영향 분석</h3>
        <p className="text-xs text-gray-400 mt-0.5">이벤트가 주가에 미치는 인과관계를 분석합니다</p>
      </div>

      {/* 이벤트 카드 목록 */}
      {data.events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      {/* 종합 AI 의견 */}
      <div className={`rounded-xl border p-4 ${opinionStyle.className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-800">종합 의견</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${opinionStyle.badge}`}>
            {opinionStyle.label}
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{data.opinionSummary}</p>
        <p className="mt-2 text-[10px] text-gray-400">
          * 투자 참고용 정보이며 실제 투자 결정은 본인 판단하에 이루어져야 합니다.
        </p>
      </div>
    </div>
  )
}
