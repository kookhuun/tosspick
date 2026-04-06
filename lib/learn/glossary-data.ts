export interface GlossaryTerm {
  id: string
  term: string
  term_en?: string
  short_def: string
  full_explanation: string
  example?: string
  category: 'indicator' | 'chart' | 'fundamental' | 'market' | 'trading' | 'general'
  related_terms?: string[]
  has_visual: boolean
  visual_type?: 'formula' | 'chart_example' | 'diagram'
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ── 지표 (indicator) ──────────────────────────────────────────────
  {
    id: 'per',
    term: 'PER',
    term_en: 'Price Earnings Ratio',
    short_def: '주가가 주당 순이익(EPS)의 몇 배인지 나타내는 지표',
    full_explanation:
      'PER(주가수익비율)은 현재 주가를 주당순이익(EPS)으로 나눈 값입니다. 투자자들이 1원의 이익을 얻기 위해 얼마를 지불하는지를 나타냅니다. PER이 낮을수록 이익 대비 저평가 상태로 볼 수 있으나, 업종별로 적정 수준이 다릅니다. 성장주는 높은 PER을, 가치주는 낮은 PER을 보이는 경향이 있습니다. 동일 업종 내 비교 또는 과거 PER 추이와 비교하는 것이 중요합니다.',
    example:
      '주가 50,000원, EPS 5,000원이면 PER = 10배. 시장 평균 PER이 15배라면 해당 종목은 저평가 가능성이 있습니다.',
    category: 'indicator',
    related_terms: ['eps', 'pbr', 'roe'],
    has_visual: true,
    visual_type: 'formula',
  },
  {
    id: 'pbr',
    term: 'PBR',
    term_en: 'Price Book-value Ratio',
    short_def: '주가가 주당 순자산(BPS)의 몇 배인지 나타내는 지표',
    full_explanation:
      'PBR(주가순자산비율)은 주가를 주당순자산가치(BPS)로 나눈 값입니다. PBR 1배는 시가총액이 장부상 순자산과 같다는 의미이며, 1배 미만이면 청산 가치보다 싸게 거래된다고 볼 수 있습니다. 금융주처럼 자산 규모가 중요한 업종에서 특히 유용하게 활용됩니다. 높은 PBR은 시장이 해당 기업의 성장성을 높이 평가한다는 의미입니다.',
    example:
      '주가 30,000원, BPS 20,000원이면 PBR = 1.5배. 보통 1배 미만이면 저평가로 판단하는 경우가 많습니다.',
    category: 'indicator',
    related_terms: ['bps', 'per', 'roe'],
    has_visual: true,
    visual_type: 'formula',
  },
  {
    id: 'eps',
    term: 'EPS',
    term_en: 'Earnings Per Share',
    short_def: '주당 순이익 — 1주당 얼마의 이익을 창출했는지 보여주는 지표',
    full_explanation:
      'EPS(주당순이익)는 기업의 당기순이익을 발행주식 수로 나눈 값입니다. EPS가 높을수록 주당 수익 창출 능력이 뛰어난 기업입니다. PER 계산의 기초가 되며, 분기별 EPS 성장률은 성장주 투자에서 핵심 지표로 활용됩니다. EPS는 회계 기준 변경이나 일회성 항목에 영향을 받으므로 조정 EPS(Adjusted EPS)도 함께 확인하는 것이 좋습니다.',
    example:
      '당기순이익 100억 원, 발행주식 수 100만 주이면 EPS = 10,000원.',
    category: 'indicator',
    related_terms: ['per', 'roe', '순이익'],
    has_visual: false,
  },
  {
    id: 'roe',
    term: 'ROE',
    term_en: 'Return On Equity',
    short_def: '자기자본으로 얼마나 이익을 창출했는지 보여주는 수익성 지표',
    full_explanation:
      'ROE(자기자본이익률)는 당기순이익을 자기자본으로 나누어 100을 곱한 값입니다. 주주가 투자한 자본을 얼마나 효율적으로 활용하는지를 보여줍니다. 일반적으로 ROE 15% 이상이면 우수한 기업으로 평가하며, 워런 버핏은 ROE를 기업 경쟁력 판단의 핵심 지표로 사용합니다. 부채를 과도하게 활용해도 ROE가 높아질 수 있으므로 부채비율과 함께 분석해야 합니다.',
    example:
      '순이익 50억 원, 자기자본 200억 원이면 ROE = 25%. 경쟁사 ROE가 10%라면 뛰어난 수익성을 보유한 것입니다.',
    category: 'indicator',
    related_terms: ['roa', 'per', 'eps', '부채비율'],
    has_visual: true,
    visual_type: 'formula',
  },
  {
    id: 'roa',
    term: 'ROA',
    term_en: 'Return On Assets',
    short_def: '총자산 대비 얼마나 이익을 냈는지 보여주는 수익성 지표',
    full_explanation:
      'ROA(총자산이익률)는 당기순이익을 총자산으로 나누어 100을 곱한 값입니다. ROE와 달리 부채를 포함한 모든 자산을 얼마나 효율적으로 활용했는지를 보여줍니다. 은행·금융 업종처럼 부채 비중이 높은 기업 분석에 유용합니다. 일반적으로 ROA 5% 이상이면 양호한 수준으로 평가됩니다.',
    example:
      '순이익 30억 원, 총자산 600억 원이면 ROA = 5%.  ROE보다 낮은 ROA는 부채 활용도가 높다는 신호일 수 있습니다.',
    category: 'indicator',
    related_terms: ['roe', 'per', '부채비율'],
    has_visual: false,
  },
  {
    id: 'bps',
    term: 'BPS',
    term_en: 'Book-value Per Share',
    short_def: '주당 순자산가치 — 1주당 보유한 순자산 규모를 나타내는 지표',
    full_explanation:
      'BPS(주당순자산가치)는 기업의 순자산(자기자본)을 발행주식 수로 나눈 값입니다. 기업이 청산될 때 주주가 받을 수 있는 이론적 가치를 뜻합니다. PBR 계산의 기초가 되며, BPS가 꾸준히 증가하는 기업은 내재 가치가 성장하고 있다는 신호입니다. 자사주 매입 시 BPS가 상승하는 효과가 있습니다.',
    example:
      '자기자본 500억 원, 발행주식 수 500만 주이면 BPS = 10,000원. 주가가 8,000원이면 PBR = 0.8배로 저평가.',
    category: 'indicator',
    related_terms: ['pbr', 'per', '자기자본비율'],
    has_visual: false,
  },
  {
    id: '배당수익률',
    term: '배당수익률',
    term_en: 'Dividend Yield',
    short_def: '주가 대비 연간 배당금 비율',
    full_explanation:
      '배당수익률은 연간 배당금을 현재 주가로 나누어 100을 곱한 값입니다. 은행 예금 이자와 비슷하게 주식 보유만으로 얻는 현금 수익률을 나타냅니다. 배당수익률이 높을수록 안정적 수익이 가능하지만, 실적 악화로 인한 주가 하락 시 배당수익률이 일시적으로 높아 보이는 함정도 있습니다. 통상 3~5% 이상이면 고배당주로 분류합니다.',
    example:
      '주가 50,000원, 연간 배당금 2,000원이면 배당수익률 = 4%. 은행 금리 3%보다 높아 매력적입니다.',
    category: 'indicator',
    related_terms: ['배당성향', '배당주'],
    has_visual: false,
  },
  {
    id: '배당성향',
    term: '배당성향',
    term_en: 'Dividend Payout Ratio',
    short_def: '순이익 중 배당금으로 지급하는 비율',
    full_explanation:
      '배당성향은 당기순이익에서 배당금으로 지급되는 비율을 나타냅니다. 배당성향이 높으면 주주 환원에 적극적이지만 성장을 위한 재투자 여력이 줄어듭니다. 반대로 배당성향이 낮으면 이익의 대부분을 사업에 재투자하는 성장형 기업일 가능성이 높습니다. 선진국 우량 기업은 통상 30~50%의 배당성향을 유지합니다.',
    example:
      '순이익 100억 원, 배당금 총액 30억 원이면 배당성향 = 30%.',
    category: 'indicator',
    related_terms: ['배당수익률', '배당주', 'eps'],
    has_visual: false,
  },

  // ── 차트 (chart) ─────────────────────────────────────────────────
  {
    id: '이동평균선',
    term: '이동평균선',
    term_en: 'Moving Average',
    short_def: '일정 기간 주가의 평균을 이어 만든 선',
    full_explanation:
      '이동평균선(MA)은 일정 기간 동안의 종가 평균을 이어 그린 선입니다. 주로 5일, 20일, 60일, 120일, 240일선을 사용합니다. 단기 이동평균선이 장기 이동평균선을 상향 돌파하면 골든크로스, 하향 돌파하면 데드크로스라 부릅니다. 추세의 방향과 지지/저항 역할을 하며 가장 기본적인 기술적 분석 도구입니다.',
    example:
      '20일 이동평균선은 최근 20거래일의 종가 평균입니다. 주가가 20일선 위에서 거래되면 단기 상승 추세로 해석합니다.',
    category: 'chart',
    related_terms: ['골든크로스', '데드크로스', 'macd'],
    has_visual: false,
  },
  {
    id: '볼린저밴드',
    term: '볼린저밴드',
    term_en: 'Bollinger Band',
    short_def: '이동평균선 ± 2표준편차로 만든 상·하한 밴드',
    full_explanation:
      '볼린저밴드는 중심선(20일 이동평균)과 상단밴드(+2σ), 하단밴드(-2σ)로 구성됩니다. 주가가 상단밴드에 닿으면 과매수, 하단밴드에 닿으면 과매도 신호로 해석하기도 합니다. 밴드 폭이 좁아지는 스퀴즈 구간은 곧 큰 변동성이 올 수 있다는 신호입니다. 단독으로 사용보다는 RSI·MACD 등과 병행 사용하는 것이 효과적입니다.',
    example:
      '주가가 하단밴드까지 하락한 후 반등하는 패턴을 "밴드 워크"라 하며, 추세 추종 전략에 활용됩니다.',
    category: 'chart',
    related_terms: ['이동평균선', 'rsi', '거래량'],
    has_visual: false,
  },
  {
    id: 'macd',
    term: 'MACD',
    term_en: 'Moving Average Convergence Divergence',
    short_def: '단기·장기 이동평균의 차이를 이용한 추세 추종 지표',
    full_explanation:
      'MACD는 12일 지수이동평균(EMA)과 26일 EMA의 차이(MACD선)와 그 9일 EMA(시그널선)로 구성됩니다. MACD선이 시그널선을 상향 돌파하면 매수, 하향 돌파하면 매도 신호로 해석합니다. 히스토그램(MACD - 시그널)이 양수에서 음수로 전환되면 모멘텀이 약해진다는 의미입니다. 추세 전환을 비교적 빠르게 포착하는 지표로 많이 사용됩니다.',
    example:
      'MACD선이 0선을 상향 돌파하면 강세 전환 신호로, 0선 하향 돌파는 약세 전환 신호로 봅니다.',
    category: 'chart',
    related_terms: ['이동평균선', 'rsi', '골든크로스'],
    has_visual: false,
  },
  {
    id: 'rsi',
    term: 'RSI',
    term_en: 'Relative Strength Index',
    short_def: '0~100 사이 값으로 과매수/과매도를 판단하는 모멘텀 지표',
    full_explanation:
      'RSI(상대강도지수)는 일정 기간(보통 14일) 동안 상승폭과 하락폭의 비율로 계산됩니다. RSI 70 이상이면 과매수(조정 가능), 30 이하이면 과매도(반등 가능) 구간으로 해석합니다. 강한 추세에서는 RSI가 과매수/과매도 구간에 오래 머물기도 합니다. 다이버전스(주가-RSI 방향 불일치)는 추세 전환의 선행 신호가 될 수 있습니다.',
    example:
      '14일 RSI = 25이면 과매도 구간으로 단기 반등 가능성을 검토합니다. RSI = 75이면 과매수 구간으로 차익 실현을 고려합니다.',
    category: 'chart',
    related_terms: ['macd', '볼린저밴드', '이동평균선'],
    has_visual: false,
  },
  {
    id: '거래량',
    term: '거래량',
    term_en: 'Volume',
    short_def: '하루 동안 거래된 주식 수 — 투자 심리와 추세 강도를 나타냄',
    full_explanation:
      '거래량은 주가 움직임의 신뢰도를 확인하는 핵심 지표입니다. 주가 상승과 함께 거래량이 증가하면 상승 추세가 강화된다는 신호, 주가 상승에도 거래량이 줄면 추세 약화 신호입니다. 평소보다 3배 이상 거래량이 터지는 "거래량 폭발"은 세력 개입이나 중요 변수 발생을 의미하는 경우가 많습니다. 이동평균 거래량 대비 오늘 거래량을 비교하는 것이 기본입니다.',
    example:
      '호재 뉴스 발표 후 주가가 5% 상승하면서 평균 거래량의 5배 이상 거래가 터지면 강한 매수세 유입으로 해석합니다.',
    category: 'chart',
    related_terms: ['이동평균선', '캔들차트', '지지선'],
    has_visual: false,
  },
  {
    id: '캔들차트',
    term: '캔들차트',
    term_en: 'Candlestick Chart',
    short_def: '시가·고가·저가·종가 4가지 정보를 하나의 캔들로 표현한 차트',
    full_explanation:
      '캔들차트는 일본에서 유래한 가격 표현 방식으로, 각 캔들은 시가(시작가)·고가·저가·종가로 구성됩니다. 몸통(Body)은 시가와 종가의 차이를 나타내며, 상승 캔들은 빨간색(또는 흰색), 하락 캔들은 파란색(또는 검정)으로 표시합니다. 꼬리(위꼬리·아래꼬리)는 그날의 고가와 저가를 나타냅니다. 망치형, 도지, 십자가 등 다양한 캔들 패턴이 매매 신호로 활용됩니다.',
    example:
      '위꼬리가 긴 캔들(유성형)이 고점에서 나타나면 매도 압력이 강했다는 의미로 하락 반전 신호로 봅니다.',
    category: 'chart',
    related_terms: ['거래량', '지지선', '저항선'],
    has_visual: false,
  },
  {
    id: '지지선',
    term: '지지선',
    term_en: 'Support Line',
    short_def: '주가 하락 시 매수세가 유입되어 반등이 나타나는 가격 구간',
    full_explanation:
      '지지선은 과거에 주가가 여러 차례 하락하다가 반등한 가격대를 연결한 선입니다. 지지선에서 매수세가 강해져 주가 하락이 멈추는 경향이 있습니다. 지지선이 무너지면(하향 이탈) 다음 지지선까지 하락이 이어지는 경우가 많습니다. 이전 저항선이 돌파되면 새로운 지지선이 되는 "지지-저항 전환" 원리도 중요합니다.',
    example:
      '특정 주가가 세 차례 50,000원 부근에서 반등했다면 50,000원이 강한 지지선입니다.',
    category: 'chart',
    related_terms: ['저항선', '캔들차트', '이동평균선'],
    has_visual: false,
  },
  {
    id: '저항선',
    term: '저항선',
    term_en: 'Resistance Line',
    short_def: '주가 상승 시 매도세가 강해져 상승이 막히는 가격 구간',
    full_explanation:
      '저항선은 주가가 상승하다가 여러 차례 꺾인 가격대를 연결한 선입니다. 저항선 부근에서 매물 출회가 많아 주가가 더 오르기 어렵습니다. 저항선을 강하게 돌파하면 이후 그 가격대가 지지선으로 바뀌는 경우가 많습니다. 52주 신고가 근처는 역사적 저항선 역할을 하기도 합니다.',
    example:
      '주가가 세 차례 70,000원을 넘지 못하고 하락했다면 70,000원이 강한 저항선입니다.',
    category: 'chart',
    related_terms: ['지지선', '캔들차트', '52주 신고가/신저가'],
    has_visual: false,
  },
  {
    id: '골든크로스',
    term: '골든크로스',
    term_en: 'Golden Cross',
    short_def: '단기 이동평균선이 장기 이동평균선을 상향 돌파하는 강세 신호',
    full_explanation:
      '골든크로스는 단기(예: 20일) 이동평균선이 장기(예: 60일) 이동평균선을 아래에서 위로 돌파하는 현상입니다. 주가 상승 추세로의 전환을 알리는 강세 신호로 해석됩니다. 거래량이 동반 증가하면 신호의 신뢰도가 높아집니다. 단, 횡보 구간에서는 잦은 골든크로스·데드크로스가 반복되는 위험이 있으므로 다른 지표와 함께 활용해야 합니다.',
    example:
      '20일 이동평균선이 60일 이동평균선 위로 올라서는 시점을 골든크로스라 하며, 매수 타이밍으로 활용합니다.',
    category: 'chart',
    related_terms: ['데드크로스', '이동평균선', 'macd'],
    has_visual: false,
  },
  {
    id: '데드크로스',
    term: '데드크로스',
    term_en: 'Dead Cross',
    short_def: '단기 이동평균선이 장기 이동평균선을 하향 돌파하는 약세 신호',
    full_explanation:
      '데드크로스는 단기 이동평균선이 장기 이동평균선을 위에서 아래로 돌파하는 현상입니다. 주가 하락 추세 전환의 신호로 해석됩니다. 거래량이 증가하면서 데드크로스가 발생하면 하락 추세가 강화될 가능성이 높습니다. 골든크로스와 마찬가지로 단독 신호보다는 다른 지표와 복합적으로 판단하는 것이 중요합니다.',
    example:
      '20일선이 60일선 아래로 내려가는 데드크로스 발생 후 주가가 추가 하락하는 경우가 많습니다.',
    category: 'chart',
    related_terms: ['골든크로스', '이동평균선', 'macd'],
    has_visual: false,
  },

  // ── 펀더멘털 (fundamental) ────────────────────────────────────────
  {
    id: '시가총액',
    term: '시가총액',
    term_en: 'Market Capitalization',
    short_def: '현재 주가 × 발행주식 수 — 기업의 시장 가치 총합',
    full_explanation:
      '시가총액은 기업의 현재 주가에 상장 주식 수를 곱한 값으로, 시장이 평가하는 기업의 총 가치입니다. 대형주·중형주·소형주 분류의 기준이 되며, 코스피 200 등 지수 구성 종목 선정에 활용됩니다. 시가총액이 클수록 유동성이 높고 주가 조작이 어렵습니다. 시가총액과 실제 기업 가치를 비교하는 것이 가치 투자의 핵심입니다.',
    example:
      '주가 50,000원, 발행주식 1억 주이면 시가총액 = 5조 원. 코스피 시총 1위는 삼성전자로 수백 조 원 규모입니다.',
    category: 'fundamental',
    related_terms: ['per', 'pbr', '유동비율'],
    has_visual: false,
  },
  {
    id: '매출액',
    term: '매출액',
    term_en: 'Revenue',
    short_def: '기업이 제품·서비스 판매로 벌어들인 총 수입',
    full_explanation:
      '매출액(또는 매출)은 기업이 본업을 통해 벌어들인 총 수입을 의미합니다. 매출 성장률은 기업의 사업 확장 속도를 보여주는 핵심 지표입니다. 매출은 높더라도 비용이 많으면 이익이 줄어들므로 영업이익률(영업이익/매출)과 함께 분석해야 합니다. 성장주 투자에서는 절대 이익보다 매출 성장률을 더 중시하는 경우가 많습니다.',
    example:
      '전년 매출 1,000억 원에서 올해 1,300억 원으로 증가하면 매출 성장률 30%.',
    category: 'fundamental',
    related_terms: ['영업이익', '순이익', '손익계산서'],
    has_visual: false,
  },
  {
    id: '영업이익',
    term: '영업이익',
    term_en: 'Operating Income',
    short_def: '매출에서 영업 관련 비용을 뺀 본업의 이익',
    full_explanation:
      '영업이익은 매출액에서 매출원가와 판매비·관리비를 뺀 값으로, 기업의 핵심 사업 수익성을 나타냅니다. 영업이익률(영업이익/매출액 × 100)이 높을수록 원가 관리와 수익성이 뛰어난 기업입니다. 이자비용·세금을 반영하기 전 수치이므로 순이익보다 본업 경쟁력을 순수하게 비교하기에 좋습니다. 영업이익이 마이너스(영업손실)인 기업은 본업에서 손해를 보는 상태입니다.',
    example:
      '매출 1,000억 원, 원가 및 판관비 800억 원이면 영업이익 200억 원(영업이익률 20%).',
    category: 'fundamental',
    related_terms: ['매출액', '순이익', '손익계산서'],
    has_visual: false,
  },
  {
    id: '순이익',
    term: '순이익',
    term_en: 'Net Income',
    short_def: '영업이익에서 이자·세금 등 모든 비용을 뺀 최종 이익',
    full_explanation:
      '순이익(당기순이익)은 매출에서 원가·판관비·이자비용·세금 등을 모두 차감한 최종 이익입니다. EPS(주당순이익) 계산의 기반이 되며, 배당의 원천이 됩니다. 영업이익보다 낮은 순이익은 높은 이자비용이나 세금 부담을 의미합니다. 일회성 항목(자산 매각 이익 등)이 순이익을 부풀릴 수 있으므로 조정 순이익도 확인해야 합니다.',
    example:
      '영업이익 200억 원에서 이자비용 20억, 법인세 40억을 빼면 순이익 140억 원.',
    category: 'fundamental',
    related_terms: ['영업이익', 'eps', '손익계산서'],
    has_visual: false,
  },
  {
    id: '부채비율',
    term: '부채비율',
    term_en: 'Debt-to-Equity Ratio',
    short_def: '자기자본 대비 총부채 비율 — 재무 건전성을 나타내는 지표',
    full_explanation:
      '부채비율은 총부채를 자기자본으로 나누어 100을 곱한 값입니다. 부채비율이 높을수록 재무 위험이 크지만, 레버리지 효과로 수익률도 높아집니다. 업종별로 적정 수준이 다르며(금융업은 높은 편), 일반 제조업에서는 100~200% 이하를 건전한 수준으로 봅니다. 경기 침체 시 부채비율이 높은 기업은 유동성 위기에 빠질 위험이 큽니다.',
    example:
      '총부채 300억 원, 자기자본 200억 원이면 부채비율 = 150%. 동종 업계 평균(200%)보다 낮아 재무 건전성이 양호합니다.',
    category: 'fundamental',
    related_terms: ['유동비율', '자기자본비율', 'roe', '대차대조표'],
    has_visual: true,
    visual_type: 'formula',
  },
  {
    id: '유동비율',
    term: '유동비율',
    term_en: 'Current Ratio',
    short_def: '1년 이내 갚아야 할 부채 대비 1년 이내 현금화 가능 자산 비율',
    full_explanation:
      '유동비율은 유동자산을 유동부채로 나누어 100을 곱한 값입니다. 단기 채무 상환 능력을 나타내며, 200% 이상이면 양호, 100% 이하이면 단기 유동성 위험이 있는 것으로 봅니다. 유동비율이 너무 높으면 자산을 효율적으로 활용하지 못한다는 의미이기도 합니다. 당좌비율(재고 제외)과 함께 보는 것이 더 정확합니다.',
    example:
      '유동자산 400억 원, 유동부채 200억 원이면 유동비율 = 200%. 단기 채무 상환 능력이 충분한 상태입니다.',
    category: 'fundamental',
    related_terms: ['부채비율', '자기자본비율', '대차대조표'],
    has_visual: false,
  },
  {
    id: '자기자본비율',
    term: '자기자본비율',
    term_en: 'Equity Ratio',
    short_def: '총자산 중 자기자본이 차지하는 비율',
    full_explanation:
      '자기자본비율(= 자본비율)은 자기자본을 총자산으로 나누어 100을 곱한 값입니다. 자기자본비율이 높을수록 외부 차입에 의존도가 낮아 재무 안정성이 높습니다. 50% 이상이면 재무 건전성이 양호한 것으로 평가합니다. 부채비율과 역관계에 있으며, 자기자본비율 + 부채비율/(1+부채비율) = 1입니다.',
    example:
      '총자산 1,000억 원, 자기자본 600억 원이면 자기자본비율 = 60%. 부채 의존도가 낮아 안전한 재무 구조입니다.',
    category: 'fundamental',
    related_terms: ['부채비율', '유동비율', 'roe', 'bps'],
    has_visual: false,
  },
  {
    id: '재무제표',
    term: '재무제표',
    term_en: 'Financial Statements',
    short_def: '기업의 재무 상태와 경영 성과를 보여주는 공식 회계 문서',
    full_explanation:
      '재무제표는 기업이 주주·투자자·채권자에게 재무 상태를 공시하는 문서입니다. 손익계산서, 대차대조표(재무상태표), 현금흐름표, 자본변동표가 핵심 구성 요소입니다. 상장 기업은 분기별·연간으로 재무제표를 공시하며, 금융감독원 전자공시시스템(DART)에서 확인할 수 있습니다. 숫자를 꿰뚫어 보는 재무제표 분석 능력이 가치 투자의 기본입니다.',
    example:
      '삼성전자의 분기 실적 발표 시 손익계산서(매출·영업이익)와 대차대조표(부채·자본)가 주목받습니다.',
    category: 'fundamental',
    related_terms: ['손익계산서', '대차대조표', '현금흐름표'],
    has_visual: false,
  },
  {
    id: '손익계산서',
    term: '손익계산서',
    term_en: 'Income Statement',
    short_def: '일정 기간 매출-비용-이익을 보여주는 경영 성과 보고서',
    full_explanation:
      '손익계산서는 일정 기간(분기 또는 연간) 동안의 매출, 원가, 이익을 단계적으로 보여줍니다. 매출 → 매출총이익 → 영업이익 → 세전이익 → 당기순이익 순서로 읽습니다. 매출 성장률, 영업이익률, 순이익률 등 핵심 수익성 지표가 여기서 도출됩니다. 분기별 변화를 추적하면 기업의 실적 모멘텀을 파악할 수 있습니다.',
    example:
      '손익계산서에서 매출은 늘었지만 영업이익이 줄었다면, 원가나 판관비 증가를 의심할 수 있습니다.',
    category: 'fundamental',
    related_terms: ['매출액', '영업이익', '순이익', '재무제표'],
    has_visual: false,
  },
  {
    id: '대차대조표',
    term: '대차대조표',
    term_en: 'Balance Sheet',
    short_def: '특정 시점의 자산·부채·자본을 보여주는 재무 상태 보고서',
    full_explanation:
      '대차대조표(재무상태표)는 기업이 "지금 무엇을 가지고 있고(자산), 어디서 돈을 빌렸으며(부채), 주주 몫이 얼마인지(자본)"를 보여줍니다. 자산 = 부채 + 자본이라는 항등식이 항상 성립합니다. 유동성 분석(유동비율), 레버리지 분석(부채비율), 자산 구성 분석에 활용됩니다. 결산일 기준 "스냅샷"이므로 시계열로 비교하는 것이 중요합니다.',
    example:
      '총자산 1조 원, 총부채 4,000억 원이면 자기자본 6,000억 원. 재무 건전성이 양호합니다.',
    category: 'fundamental',
    related_terms: ['재무제표', '부채비율', '유동비율', 'bps'],
    has_visual: false,
  },
  {
    id: '현금흐름표',
    term: '현금흐름표',
    term_en: 'Cash Flow Statement',
    short_def: '영업·투자·재무 활동의 실제 현금 유입·유출을 보여주는 보고서',
    full_explanation:
      '현금흐름표는 영업활동, 투자활동, 재무활동별 현금 움직임을 보여줍니다. 영업활동 현금흐름(OCF)은 기업의 본업이 실제로 현금을 창출하는지를 나타냅니다. 순이익이 높더라도 영업 현금흐름이 낮으면 이익의 질이 낮다고 판단합니다. 자유현금흐름(FCF = OCF - 설비투자)은 배당·자사주 매입·신사업 투자 여력을 보여줍니다.',
    example:
      '순이익 100억 원이지만 영업 현금흐름이 -20억 원이면 실제 현금 창출 능력에 문제가 있을 수 있습니다.',
    category: 'fundamental',
    related_terms: ['재무제표', '손익계산서', '영업이익'],
    has_visual: false,
  },

  // ── 시장 (market) ────────────────────────────────────────────────
  {
    id: '코스피',
    term: '코스피',
    term_en: 'KOSPI',
    short_def: '한국 유가증권시장에 상장된 종목들의 주가지수',
    full_explanation:
      '코스피(KOSPI: Korea Composite Stock Price Index)는 한국거래소 유가증권시장에 상장된 전체 종목의 주가를 가중평균한 지수입니다. 1980년 1월 4일 기준값 100에서 시작했습니다. 삼성전자·SK하이닉스·LG에너지솔루션 등 대형 우량주가 포함됩니다. 코스피 지수는 한국 경제와 기업 실적의 바로미터 역할을 합니다.',
    example:
      '코스피 2,500포인트는 1980년 기준 대비 주가 수준이 25배 올랐음을 의미합니다.',
    category: 'market',
    related_terms: ['코스닥', 's&p500', '서킷브레이커'],
    has_visual: false,
  },
  {
    id: '코스닥',
    term: '코스닥',
    term_en: 'KOSDAQ',
    short_def: '중소·벤처기업 중심의 한국 제2 증권 시장 지수',
    full_explanation:
      '코스닥(KOSDAQ: Korea Securities Dealers Automated Quotation)은 코스피보다 상장 기준이 낮아 중소기업, IT·바이오·게임 등 성장형 기업이 많이 포함됩니다. 변동성이 코스피보다 높은 편입니다. 1996년 개설 이후 많은 벤처 기업의 자금 조달 창구 역할을 해왔습니다. 코스닥 상장 기업은 기술력 중심으로 평가받는 경우가 많습니다.',
    example:
      '카카오·셀트리온 같은 기업들이 코스닥에서 코스피로 이전 상장한 사례가 있습니다.',
    category: 'market',
    related_terms: ['코스피', '나스닥', 'ipo'],
    has_visual: false,
  },
  {
    id: '나스닥',
    term: '나스닥',
    term_en: 'NASDAQ',
    short_def: '미국 기술주·성장주 중심의 전자 주식 시장 지수',
    full_explanation:
      '나스닥(NASDAQ)은 1971년 설립된 세계 최초의 전자 주식 시장으로, 애플·마이크로소프트·알파벳·엔비디아 등 글로벌 빅테크 기업이 상장돼 있습니다. 나스닥 종합지수와 기술주 100종목을 추적하는 나스닥 100(QQQ)이 대표적입니다. S&P 500 대비 기술주 비중이 높아 변동성이 크고 성장 국면에서 강한 퍼포먼스를 보입니다.',
    example:
      '나스닥 지수가 연초 대비 30% 상승했다는 것은 기술주 전반이 강세장임을 의미합니다.',
    category: 'market',
    related_terms: ['s&p500', '코스피', '코스닥'],
    has_visual: false,
  },
  {
    id: 's&p500',
    term: 'S&P500',
    term_en: 'S&P 500',
    short_def: '미국 상위 500개 대형주로 구성된 대표 주가지수',
    full_explanation:
      'S&P 500은 스탠더드앤드푸어스(S&P)가 산출하는 미국 대형주 500개 종목의 시가총액 가중 지수입니다. 미국 주식 시장 전체의 80% 이상을 커버하는 가장 대표적인 벤치마크입니다. 전 세계 기관 투자자들이 S&P 500을 벤치마크로 사용하며, SPY·IVV 등 ETF를 통해 쉽게 투자할 수 있습니다. 워런 버핏도 S&P 500 인덱스 펀드 투자를 반복 권고했습니다.',
    example:
      'S&P 500에 매월 일정 금액을 적립식 투자하는 전략은 장기적으로 대부분의 액티브 펀드를 능가했습니다.',
    category: 'market',
    related_terms: ['나스닥', '코스피', '포트폴리오'],
    has_visual: false,
  },
  {
    id: '공매도',
    term: '공매도',
    term_en: 'Short Selling',
    short_def: '주가 하락을 예상해 주식을 빌려 팔고 나중에 싼 값에 되사는 전략',
    full_explanation:
      '공매도는 주식을 보유하지 않은 상태에서 빌려서 팔고(매도), 주가가 하락하면 낮은 가격에 다시 사서(매수) 갚는 방식입니다. 주가 하락 시 이익이 발생하지만 주가가 상승하면 손실이 무한대로 커질 수 있어 고위험 전략입니다. 시장 유동성 공급과 가격 발견 기능이 있지만, 개인 투자자는 기관·외국인 대비 불리한 구조라는 비판이 있습니다.',
    example:
      '주당 100,000원에 빌려서 팔고 80,000원에 되사면 주당 20,000원 이익. 반대로 120,000원이 되면 주당 20,000원 손실.',
    category: 'market',
    related_terms: ['인버스', '레버리지', '포트폴리오'],
    has_visual: false,
  },
  {
    id: '서킷브레이커',
    term: '서킷브레이커',
    term_en: 'Circuit Breaker',
    short_def: '주가 급락 시 거래를 일시 중단시키는 시장 안전 장치',
    full_explanation:
      '서킷브레이커는 주가 지수가 단시간에 급격히 하락할 때 시장 패닉을 방지하기 위해 매매를 일시 중단하는 제도입니다. 한국은 코스피·코스닥이 전일 대비 8%, 15%, 20% 이상 하락 시 각 단계별로 발동됩니다. 발동 시 20분간 매매가 중단되고 재개 후 10분 단일가 매매로 전환됩니다. 2020년 코로나19 팬데믹 당시 전 세계 증시에서 동시다발적으로 발동됐습니다.',
    example:
      '2020년 3월 코로나 급락 장세에서 코스피가 장중 8% 이상 하락해 서킷브레이커가 발동됐습니다.',
    category: 'market',
    related_terms: ['코스피', '코스닥'],
    has_visual: false,
  },
  {
    id: '시장가',
    term: '시장가',
    term_en: 'Market Order',
    short_def: '가격 지정 없이 현재 가장 좋은 호가로 즉시 체결하는 주문',
    full_explanation:
      '시장가 주문은 주식을 즉시 사거나 팔기 위해 가격을 지정하지 않는 주문입니다. 매수 시장가는 현재 가장 낮은 매도 호가에서 체결되고, 매도 시장가는 가장 높은 매수 호가에서 체결됩니다. 빠른 체결이 보장되지만 원하는 가격에 체결되지 않을 수 있습니다. 유동성이 낮은 종목에서 시장가 주문은 불리한 가격에 체결될 위험이 있습니다.',
    example:
      '급하게 매도할 때 시장가 주문을 내면 즉시 체결되지만, 호가 스프레드가 클 때는 불리합니다.',
    category: 'market',
    related_terms: ['지정가', '호가'],
    has_visual: false,
  },
  {
    id: '지정가',
    term: '지정가',
    term_en: 'Limit Order',
    short_def: '원하는 가격을 지정해 그 가격 이하(매수) 또는 이상(매도)에서만 체결',
    full_explanation:
      '지정가 주문은 투자자가 원하는 가격을 직접 지정하는 주문 방식입니다. 매수 지정가는 지정한 가격 이하에서만 체결되고, 매도 지정가는 지정한 가격 이상에서만 체결됩니다. 원하는 가격에 체결이 보장되지만 지정 가격에 도달하지 않으면 체결되지 않을 수 있습니다. 장기 투자자나 특정 가격을 목표로 하는 트레이더에게 적합합니다.',
    example:
      '현재 50,000원인 주식을 48,000원에 매수 지정가 주문을 내면 주가가 48,000원 이하로 내려올 때 체결됩니다.',
    category: 'market',
    related_terms: ['시장가', '호가'],
    has_visual: false,
  },
  {
    id: '호가',
    term: '호가',
    term_en: 'Quote',
    short_def: '매수자와 매도자가 제시한 가격 — 시장의 수요공급을 실시간으로 보여줌',
    full_explanation:
      '호가는 매수 희망자가 제시한 매수호가(Bid)와 매도 희망자가 제시한 매도호가(Ask)로 구성됩니다. 매수호가와 매도호가의 차이를 호가 스프레드라 하며, 스프레드가 좁을수록 유동성이 높은 종목입니다. 호가창에서 매수·매도 물량의 분포를 보고 단기적인 수급을 분석할 수 있습니다. 시장가 주문은 현재 최우선 호가에서 체결됩니다.',
    example:
      '매수호가 49,950원, 매도호가 50,000원이면 스프레드 50원. 삼성전자처럼 유동성이 높은 종목은 스프레드가 매우 좁습니다.',
    category: 'market',
    related_terms: ['시장가', '지정가', '거래량'],
    has_visual: false,
  },
  {
    id: '52주신고가신저가',
    term: '52주 신고가/신저가',
    term_en: '52-Week High/Low',
    short_def: '최근 1년간 가장 높았던 가격(신고가)과 가장 낮았던 가격(신저가)',
    full_explanation:
      '52주 신고가는 최근 52주(1년) 중 가장 높은 종가를, 52주 신저가는 가장 낮은 종가를 의미합니다. 주가가 52주 신고가를 돌파하면 강력한 상승 모멘텀 신호로, 신저가를 하향 돌파하면 추가 하락 위험 신호로 해석합니다. 역사적 고점·저점은 강한 저항·지지 역할을 하기도 합니다. 52주 신고가 대비 현재 주가의 괴리율로 투자 기회를 탐색하는 전략도 있습니다.',
    example:
      '52주 신고가 80,000원인 종목이 현재 50,000원이면 고점 대비 37.5% 낮은 수준입니다.',
    category: 'market',
    related_terms: ['저항선', '지지선', '모멘텀'],
    has_visual: false,
  },

  // ── 매매 (trading) ───────────────────────────────────────────────
  {
    id: '손절',
    term: '손절',
    term_en: 'Stop Loss / Cut Loss',
    short_def: '손실을 감수하고 주식을 매도해 추가 손실을 막는 행동',
    full_explanation:
      '손절(손실 절단)은 매수한 주가가 일정 수준 이상 하락할 때 손실이 더 커지기 전에 매도하는 행위입니다. 감정적 판단보다 미리 정해둔 손절 기준(예: -5%, -10%)에 따라 기계적으로 실행하는 것이 중요합니다. 손절을 못 해 큰 손실로 이어지는 경우가 초보 투자자의 흔한 실수입니다. "손절은 투자의 보험"이라는 말처럼 리스크 관리의 핵심입니다.',
    example:
      '50,000원에 매수 후 45,000원(-10%)이 되면 손절 매도. 추가 하락 시 손실을 최소화합니다.',
    category: 'trading',
    related_terms: ['익절', '평균단가', '포트폴리오'],
    has_visual: false,
  },
  {
    id: '익절',
    term: '익절',
    term_en: 'Take Profit',
    short_def: '목표 수익에 도달했을 때 매도해 이익을 확정하는 행동',
    full_explanation:
      '익절(이익 절취)은 주가가 목표한 수익률에 도달했을 때 매도하여 수익을 실현하는 행위입니다. 미실현 이익은 언제든 사라질 수 있으므로, 목표가를 미리 설정해 기계적으로 실행하는 것이 중요합니다. 전량 익절보다 목표가 도달 시 일부 매도하는 분할 익절이 리스크 관리에 유리한 경우가 많습니다. 너무 빠른 익절은 큰 수익 기회를 놓치는 원인이 될 수 있습니다.',
    example:
      '50,000원에 매수 후 목표가 60,000원(+20%) 달성 시 매도. 수익 확정 후 다음 투자 기회를 모색합니다.',
    category: 'trading',
    related_terms: ['손절', '분할매수', '포트폴리오'],
    has_visual: false,
  },
  {
    id: '평균단가',
    term: '평균단가',
    term_en: 'Average Cost',
    short_def: '여러 번 매수한 주식의 1주당 평균 매입 가격',
    full_explanation:
      '평균단가(평단가)는 주식을 여러 번에 나눠 샀을 때의 평균 매입가격을 의미합니다. 총 매입 금액을 총 보유 수량으로 나누어 계산합니다. 하락 시 추가 매수(물타기)하면 평단가가 낮아져 손익분기점이 내려갑니다. 반대로 상승 시 추가 매수(불타기)하면 평단가가 높아져 추세 추종 전략이 됩니다.',
    example:
      '50,000원에 10주, 40,000원에 10주 매수 시 평단가 = (50,000 × 10 + 40,000 × 10) / 20 = 45,000원.',
    category: 'trading',
    related_terms: ['분할매수', '물타기', '불타기'],
    has_visual: false,
  },
  {
    id: '분할매수',
    term: '분할매수',
    term_en: 'Averaging Down / Cost Averaging',
    short_def: '한 번에 전부 사지 않고 여러 번에 나눠 매수하는 전략',
    full_explanation:
      '분할매수는 원하는 주식을 일정 금액이나 가격대별로 나눠 매수하는 전략입니다. 단일 매수 대비 매수 가격 리스크를 분산시켜 평균단가를 유리하게 만들 수 있습니다. 하락장에서 분할매수 시 평단가가 낮아지고, 상승 전환 시 더 큰 수익을 낼 수 있습니다. 적립식 펀드나 ETF 투자와 같은 원리입니다.',
    example:
      '목표 주식 100주를 사려 할 때, 50주를 오늘 사고 주가 5% 하락 시 나머지 50주를 매수합니다.',
    category: 'trading',
    related_terms: ['평균단가', '물타기', '리밸런싱'],
    has_visual: false,
  },
  {
    id: '물타기',
    term: '물타기',
    term_en: 'Averaging Down',
    short_def: '주가 하락 시 추가 매수해 평균단가를 낮추는 전략',
    full_explanation:
      '물타기는 보유 주식의 주가가 하락할 때 추가 매수하여 평균단가를 낮추는 전략입니다. 단기 반등 시 더 빠르게 손익분기점에 도달할 수 있다는 장점이 있습니다. 그러나 잘못된 기업에 물타기를 반복하면 손실이 눈덩이처럼 커지는 위험이 있습니다. 기업 펀더멘털을 확인한 후 신중하게 판단해야 합니다.',
    example:
      '50,000원에 매수한 주식이 40,000원으로 하락 시 추가 매수하면 평단가가 45,000원으로 낮아집니다.',
    category: 'trading',
    related_terms: ['불타기', '평균단가', '분할매수'],
    has_visual: false,
  },
  {
    id: '불타기',
    term: '불타기',
    term_en: 'Pyramiding',
    short_def: '주가 상승 시 추가 매수해 수익을 극대화하는 추세 추종 전략',
    full_explanation:
      '불타기(피라미딩)는 주가가 상승하는 방향으로 추가 매수하여 수익을 극대화하는 전략입니다. 추세가 강하게 형성될 때 평단가를 높이며 포지션을 확대합니다. 모멘텀 투자와 잘 맞는 전략이지만, 추세 반전 시 더 높은 평단가에 대량 손실이 발생할 수 있습니다. 반드시 손절 라인을 함께 설정해야 합니다.',
    example:
      '50,000원에 100주 매수 후 55,000원에 50주 추가 매수. 주가가 60,000원이 되면 최초 100주 + 추가 50주 모두 수익.',
    category: 'trading',
    related_terms: ['물타기', '평균단가', '손절'],
    has_visual: false,
  },
  {
    id: '포트폴리오',
    term: '포트폴리오',
    term_en: 'Portfolio',
    short_def: '여러 자산에 분산 투자해 구성된 투자 묶음',
    full_explanation:
      '포트폴리오는 주식, 채권, 현금 등 다양한 자산에 분산 투자하여 위험을 줄이는 투자 묶음입니다. "달걀을 한 바구니에 담지 말라"는 분산 투자 원칙이 핵심입니다. 자산 배분 비중, 업종 분산, 지역 분산 등을 통해 개별 종목 리스크를 낮출 수 있습니다. 포트폴리오 수익률은 각 자산 수익률의 가중평균입니다.',
    example:
      '주식 60%(국내 30% + 해외 30%), 채권 30%, 현금·금 10%로 구성한 포트폴리오는 균형 잡힌 배분입니다.',
    category: 'trading',
    related_terms: ['리밸런싱', '분산투자', '가치투자'],
    has_visual: false,
  },
  {
    id: '리밸런싱',
    term: '리밸런싱',
    term_en: 'Rebalancing',
    short_def: '시간이 지나 비중이 틀어진 포트폴리오를 목표 비중으로 재조정',
    full_explanation:
      '리밸런싱은 주가 변동으로 포트폴리오 비중이 목표와 달라진 경우 매매를 통해 원래 비율로 복구하는 행위입니다. 정기적(분기·반기·연간) 또는 비중 이탈이 일정 수준을 초과할 때 실행합니다. 상승한 자산을 일부 매도하고 하락한 자산을 추가 매수하므로 자동으로 고점 매도·저점 매수 효과가 발생합니다. 장기 투자에서 리스크 관리의 핵심 도구입니다.',
    example:
      '주식 60% 채권 40%로 시작한 포트폴리오가 주가 상승으로 주식 75% 채권 25%가 됐다면 주식 일부 매도 후 채권 추가 매수.',
    category: 'trading',
    related_terms: ['포트폴리오', '분할매수'],
    has_visual: false,
  },
  {
    id: '레버리지',
    term: '레버리지',
    term_en: 'Leverage',
    short_def: '빌린 돈으로 투자 규모를 키워 수익·손실을 배로 증폭시키는 방식',
    full_explanation:
      '레버리지는 자기 자본에 빌린 돈을 더해 더 큰 규모의 투자를 하는 전략입니다. 2배 레버리지 ETF는 기초 지수 수익률의 2배를 추구합니다. 수익이 날 때는 이익이 배로 늘지만, 손실 시에는 손실도 배로 커집니다. 장기 보유 시 변동성 손실(Volatility Drag) 효과로 기대 수익보다 낮아질 수 있습니다.',
    example:
      '2배 레버리지 ETF 보유 시 기초 지수가 10% 상승하면 약 20% 수익, 10% 하락하면 약 20% 손실.',
    category: 'trading',
    related_terms: ['인버스', '공매도', '리스크'],
    has_visual: false,
  },
  {
    id: '인버스',
    term: '인버스',
    term_en: 'Inverse ETF',
    short_def: '기초 지수가 하락할 때 수익이 나도록 설계된 ETF',
    full_explanation:
      '인버스 ETF는 특정 지수가 1% 하락하면 약 1% 수익(1배 인버스) 또는 2% 수익(2배 인버스)이 나도록 설계된 상품입니다. 하락장에서 헤지(위험 회피) 목적이나 하락 방향에 베팅할 때 사용합니다. 공매도와 유사한 효과를 일반 투자자도 ETF로 쉽게 얻을 수 있습니다. 장기 보유 시 레버리지와 마찬가지로 변동성 손실이 발생합니다.',
    example:
      '코스피가 3% 하락 시 KODEX 인버스 ETF는 약 3% 상승합니다. 하락 헤지 목적으로 단기 보유가 일반적입니다.',
    category: 'trading',
    related_terms: ['레버리지', '공매도', '포트폴리오'],
    has_visual: false,
  },

  // ── 기타 (general) ───────────────────────────────────────────────
  {
    id: '공모주',
    term: '공모주',
    term_en: 'IPO Stock',
    short_def: '기업이 상장할 때 일반 투자자에게 처음으로 공개 판매하는 주식',
    full_explanation:
      '공모주는 비상장 기업이 증권시장에 상장하면서 일반 투자자에게 처음 판매하는 주식입니다. 수요예측(기관)과 일반 청약을 통해 공모가를 결정합니다. 상장 첫날 공모가 대비 높은 수익을 얻는 경우가 많아 인기가 높지만, 경쟁률이 높아 배정 수량이 매우 적을 수 있습니다. 과열된 시장에서 공모주는 상장 후 주가가 하락하는 경우도 있습니다.',
    example:
      '공모가 50,000원인 주식이 상장 첫날 80,000원으로 시작하면 60% 수익. 하지만 과열 시 공모가 이하로 하락하기도 합니다.',
    category: 'general',
    related_terms: ['ipo', '유상증자', '시가총액'],
    has_visual: false,
  },
  {
    id: 'ipo',
    term: 'IPO',
    term_en: 'Initial Public Offering',
    short_def: '기업이 처음으로 주식을 증권시장에 상장해 공개하는 절차',
    full_explanation:
      'IPO(기업공개)는 비상장 기업이 공모 절차를 통해 주식을 발행하고 증권시장에 상장하는 과정입니다. 기업은 IPO를 통해 사업 자금을 조달하고, 투자자에게는 미래 성장에 조기 투자할 기회가 생깁니다. 주관사(증권사)가 공모가 산정, 수요예측, 청약을 진행합니다. 최근에는 스팩(SPAC) 합병을 통한 우회 상장도 늘고 있습니다.',
    example:
      '카카오, 크래프톤, LG에너지솔루션 등 대형 IPO는 수십 조 원의 청약 자금이 몰리며 관심을 받았습니다.',
    category: 'general',
    related_terms: ['공모주', '유상증자', '시가총액'],
    has_visual: false,
  },
  {
    id: '유상증자',
    term: '유상증자',
    term_en: 'Rights Offering',
    short_def: '기업이 신주를 발행해 투자자에게 유료로 팔아 자금을 조달하는 방법',
    full_explanation:
      '유상증자는 기업이 신규 주식을 발행해 기존 주주나 새 투자자에게 돈을 받고 팔아 자금을 조달하는 방식입니다. 주식 수가 늘어 기존 주주의 지분율이 희석(Dilution)되는 단점이 있습니다. 자금 조달 목적이 사업 확장(긍정)인지 부채 상환(부정)인지에 따라 시장 반응이 다릅니다. 대규모 유상증자 발표 시 주가가 급락하는 경우가 많습니다.',
    example:
      '회사가 1,000억 원의 신주 발행 유상증자를 공시하면 기존 주주 지분이 희석돼 주가가 단기 하락하는 경우가 많습니다.',
    category: 'general',
    related_terms: ['무상증자', '액면분할', 'ipo'],
    has_visual: false,
  },
  {
    id: '무상증자',
    term: '무상증자',
    term_en: 'Stock Dividend / Bonus Issue',
    short_def: '기업이 이익잉여금으로 신주를 발행해 기존 주주에게 무료로 나눠주는 것',
    full_explanation:
      '무상증자는 기업이 보유한 이익잉여금이나 자본잉여금을 재원으로 신주를 발행해 기존 주주에게 보유 비율에 따라 무상으로 배분하는 방식입니다. 주식 수는 늘어나지만 총 자본금은 변하지 않아 주당 가치는 이론상 희석됩니다. 그러나 풍부한 잉여금과 주주 환원 의지를 보여줘 호재로 해석되는 경우가 많습니다. 주가도 배정 비율에 따라 권리락 처리가 됩니다.',
    example:
      '1주당 0.2주 무상증자 시, 1,000주 보유자는 200주를 추가로 받아 1,200주가 됩니다.',
    category: 'general',
    related_terms: ['유상증자', '액면분할', '자사주매입'],
    has_visual: false,
  },
  {
    id: '자사주매입',
    term: '자사주매입',
    term_en: 'Share Buyback',
    short_def: '기업이 시장에서 자기 회사 주식을 되사들이는 주주 환원 방법',
    full_explanation:
      '자사주매입(자사주 취득)은 기업이 유통 중인 자기 회사 주식을 시장에서 매수하는 행위입니다. 유통 주식 수가 줄어 주당 가치(EPS·BPS)가 상승하는 효과가 있습니다. 배당과 함께 대표적인 주주 환원 방식이며, 기업이 자사 주식이 저평가됐다는 시그널로도 해석됩니다. 취득한 자사주를 소각하면 영구적으로 주식 수가 줄어 효과가 더 강합니다.',
    example:
      '애플은 매년 수백억 달러의 자사주를 매입·소각해 주당 가치를 꾸준히 높이고 있습니다.',
    category: 'general',
    related_terms: ['배당수익률', 'eps', 'bps'],
    has_visual: false,
  },
  {
    id: '액면분할',
    term: '액면분할',
    term_en: 'Stock Split',
    short_def: '주식 1주를 여러 주로 나눠 주가를 낮추고 유동성을 높이는 방법',
    full_explanation:
      '액면분할은 고가의 주식을 여러 주로 분할해 주당 가격을 낮추는 방식입니다. 예를 들어 1:5 분할 시 500,000원짜리 1주가 100,000원짜리 5주가 됩니다. 총 자본금과 기업 가치는 변하지 않지만, 주당 가격이 낮아져 소액 투자자의 접근성이 높아집니다. 애플, 테슬라 등 주요 기업들이 주가 급등 후 액면분할을 실시한 사례가 있습니다.',
    example:
      '테슬라는 2020년 5:1 액면분할로 주가를 2,000달러대에서 400달러대로 낮춰 소액 투자자 접근성을 높였습니다.',
    category: 'general',
    related_terms: ['무상증자', '유상증자', '시가총액'],
    has_visual: false,
  },
  {
    id: '블루칩',
    term: '블루칩',
    term_en: 'Blue Chip',
    short_def: '오랜 기간 안정적 실적과 배당을 유지해온 대형 우량주',
    full_explanation:
      '블루칩은 카지노에서 가장 가치 있는 파란 칩에서 유래한 용어로, 재무 건전성과 수익 안정성이 뛰어난 대형 우량 기업을 지칭합니다. 경기 침체에도 비교적 견조한 실적을 유지하고 꾸준한 배당을 지급하는 특징이 있습니다. 삼성전자(국내), 애플·마이크로소프트(미국) 등이 대표적인 블루칩입니다. 가치 투자자들이 선호하는 장기 투자 대상입니다.',
    example:
      '블루칩 포트폴리오는 변동성이 낮고 배당 수익이 안정적이어서 장기 투자자에게 적합합니다.',
    category: 'general',
    related_terms: ['배당주', '가치투자', '포트폴리오'],
    has_visual: false,
  },
  {
    id: '가치투자',
    term: '가치투자',
    term_en: 'Value Investing',
    short_def: '내재 가치 대비 저평가된 주식을 찾아 장기 보유하는 투자 철학',
    full_explanation:
      '가치투자는 기업의 내재 가치(펀더멘털)를 분석해 현재 시장 가격보다 싼 주식을 발굴해 장기 보유하는 투자 방식입니다. 벤저민 그레이엄이 창시하고 워런 버핏이 발전시킨 투자 철학입니다. PER·PBR·ROE 등 재무 지표로 저평가 주식을 찾고, 안전마진(내재 가치 대비 할인율)을 확보하는 것이 핵심입니다. 단기 시장 변동에 흔들리지 않는 장기적 관점이 필요합니다.',
    example:
      '내재 가치가 100,000원으로 분석됐지만 시장 가격이 70,000원이면 30%의 안전마진이 존재합니다.',
    category: 'general',
    related_terms: ['성장주', '블루칩', 'per', 'pbr'],
    has_visual: false,
  },
  {
    id: '성장주',
    term: '성장주',
    term_en: 'Growth Stock',
    short_def: '현재 이익보다 미래 높은 성장률이 기대되는 주식',
    full_explanation:
      '성장주는 매출·이익 성장률이 시장 평균보다 월등히 높을 것으로 기대되는 기업의 주식입니다. 높은 PER이 허용되며, 현재 적자를 기록하더라도 미래 성장성에 프리미엄이 붙습니다. AI·바이오·전기차 등 신기술 분야 기업이 대표적입니다. 금리 인상 국면에서 미래 현금흐름의 현재 가치가 낮아져 성장주 주가가 크게 하락하는 경향이 있습니다.',
    example:
      '엔비디아, 테슬라 초기처럼 매출이 연 50% 이상 성장하며 시장 기대치를 뛰어넘는 기업이 성장주의 전형입니다.',
    category: 'general',
    related_terms: ['가치투자', '블루칩', 'per'],
    has_visual: false,
  },
  {
    id: '배당주',
    term: '배당주',
    term_en: 'Dividend Stock',
    short_def: '꾸준히 높은 배당금을 지급하는 주식',
    full_explanation:
      '배당주는 안정적인 이익을 기반으로 꾸준히 배당금을 지급하는 기업의 주식입니다. 은행·통신·유틸리티·리츠(REITs) 업종에 배당주가 많습니다. 배당수익률이 높아 은퇴 투자자나 안정적 현금흐름을 원하는 투자자에게 인기가 있습니다. "배당 귀족"은 25년 이상 연속 배당을 증가시켜온 기업을 지칭합니다.',
    example:
      '배당수익률 5%인 배당주 5,000만 원 보유 시 연간 250만 원의 배당 수입이 생깁니다.',
    category: 'general',
    related_terms: ['배당수익률', '배당성향', '블루칩'],
    has_visual: false,
  },
]

export const CATEGORY_LABELS: Record<GlossaryTerm['category'], string> = {
  indicator: '지표',
  chart: '차트',
  fundamental: '펀더멘털',
  market: '시장',
  trading: '매매',
  general: '기타',
}

export const CATEGORY_COLORS: Record<GlossaryTerm['category'], string> = {
  indicator: 'bg-blue-100 text-blue-700',
  chart: 'bg-purple-100 text-purple-700',
  fundamental: 'bg-green-100 text-green-700',
  market: 'bg-orange-100 text-orange-700',
  trading: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-700',
}

// 한글 초성 추출
function getInitialConsonant(char: string): string {
  const code = char.charCodeAt(0) - 0xac00
  if (code < 0 || code > 11171) return char.toUpperCase()
  const consonants = [
    'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ',
    'ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ',
  ]
  return consonants[Math.floor(code / 588)]
}

export function getGroupKey(term: string): string {
  const first = term[0]
  const code = first.charCodeAt(0)
  if (code >= 0xac00 && code <= 0xd7a3) return getInitialConsonant(first)
  if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) return 'A-Z'
  return '#'
}

export function groupTerms(
  terms: GlossaryTerm[]
): { key: string; terms: GlossaryTerm[] }[] {
  const map = new Map<string, GlossaryTerm[]>()
  for (const t of terms) {
    const k = getGroupKey(t.term)
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(t)
  }
  // 한글 초성 → 영문 → 기타 순 정렬
  const korOrder = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
  const keys = [...map.keys()].sort((a, b) => {
    const ai = korOrder.indexOf(a)
    const bi = korOrder.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.localeCompare(b)
  })
  return keys.map((k) => ({ key: k, terms: map.get(k)! }))
}
