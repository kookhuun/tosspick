export interface GlossaryTerm {
  id: string
  term: string
  category: 'basic' | 'indicator' | 'chart' | 'earnings' | 'macro'
  short_definition: string
  full_explanation: string
  usage: string       // 언제 쓰는지
  mistake: string     // 초보자 실수
  actionText: string  // 버튼 문구
  actionLink: string  // 이동 경로
}

export const GLOSSARY_DATA: GlossaryTerm[] = [
  {
    id: 'per',
    term: 'PER (주가수익비율)',
    category: 'indicator',
    short_definition: '기업이 버는 돈에 비해 주가가 얼마나 비싼지 나타내는 지표예요.',
    full_explanation: 'PER이 10배라면, 이 회사가 지금처럼 돈을 벌 때 10년이면 시가총액만큼의 돈을 번다는 뜻이에요. 보통 낮을수록 저평가되었다고 봐요.',
    usage: '같은 업종 내에서 어떤 종목이 상대적으로 싼지 비교할 때 가장 유용해요.',
    mistake: 'PER이 낮다고 무조건 사면 위험해요! 이익이 줄어들 것으로 예상되어 미리 주가가 빠진 "함정"일 수 있거든요.',
    actionText: '저평가 종목 찾으러 가기',
    actionLink: '/search'
  },
  {
    id: 'pbr',
    term: 'PBR (주가순자산비율)',
    category: 'indicator',
    short_definition: '기업의 순자산(장부 가격)에 비해 주가가 몇 배인지 나타내요.',
    full_explanation: 'PBR이 1배 미만이면 회사를 당장 다 팔았을 때 나오는 돈보다 주가가 더 낮다는 뜻이에요. 자산 가치가 높은 종목을 찾을 때 써요.',
    usage: '은행, 철강, 건설 등 자산이 많은 장치 산업의 바닥 가격을 확인할 때 써요.',
    mistake: 'PBR이 낮아도 수익성이 나쁘면 "만년 저평가"에 갇힐 수 있어요. 자산만 보지 말고 돈을 잘 버는지도 봐야 해요.',
    actionText: '안전한 자산주 확인하기',
    actionLink: '/market'
  },
  {
    id: 'dividend',
    term: '배당수익률',
    category: 'basic',
    short_definition: '주가 대비 1년간 받는 배당금의 비율이에요.',
    full_explanation: '은행 이자처럼 주식을 들고만 있어도 받는 현금의 비율이에요. 배당수익률이 높을수록 주주에게 이익을 많이 나눠주는 회사죠.',
    usage: '금리 하락기에 안정적인 현금 흐름을 만들고 싶을 때 높은 배당주를 골라요.',
    mistake: '배당만 보고 샀는데 주가가 배당금보다 더 많이 떨어지는 "배당락" 이후의 흐름을 조심해야 해요.',
    actionText: '고배당주 훈련 매수하기',
    actionLink: '/trading'
  },
  {
    id: 'moving-average',
    term: '이동평균선 (이평선)',
    category: 'chart',
    short_definition: '일정 기간 동안의 주가 평균을 선으로 연결한 거예요.',
    full_explanation: '5일, 20일, 60일 등 주가의 평균적인 흐름을 보여줘요. 현재 주가가 평균보다 위에 있는지 아래에 있는지 확인하는 용도예요.',
    usage: '주가가 이평선 위에 올라타서 우상향할 때 "추세가 살아있다"고 판단하고 매수 타이밍을 잡아요.',
    mistake: '이평선은 "과거"의 평균일 뿐이에요. 갑작스러운 악재로 주가가 급락할 때는 이평선 지지가 안 될 수 있어요.',
    actionText: '랜덤 차트에서 이평선 연습하기',
    actionLink: '/trading'
  }
]
