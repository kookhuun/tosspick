export interface MarketIndicatorInfo {
  title: string
  definition: string
  how_to_read: string
  caution: string
}

export const MARKET_INFO_DATA: Record<string, MarketIndicatorInfo> = {
  KOSPI: {
    title: '코스피 (KOSPI)',
    definition: '한국을 대표하는 큰 회사들(삼성전자, 현대차 등)이 모여 있는 시장의 성적표예요.',
    how_to_read: '지수가 오르면 우리나라 큰 회사들이 장사를 잘하고 있거나, 투자자들이 한국 경제를 좋게 보고 있다는 뜻이에요.',
    caution: '큰 회사들 위주라 전체 시장 분위기를 보여주지만, 개별 작은 종목들의 움직임과는 다를 수 있어요.',
  },
  KOSDAQ: {
    title: '코스닥 (KOSDAQ)',
    definition: 'IT, 바이오, 게임 등 성장 가능성이 높은 벤처 기업들이 모여 있는 시장이에요.',
    how_to_read: '코스피보다 변화폭이 커서, 오를 때 확 오르고 내릴 때도 확 내려가는 특징이 있어요.',
    caution: '성장성이 큰 만큼 위험도 높아서 투자할 때 더 꼼꼼히 살펴봐야 해요.',
  },
  'S&P 500': {
    title: 'S&P 500',
    definition: '미국에서 가장 우량한 500개 기업의 주가를 합쳐놓은 지수예요. 세계 경제의 바로미터라고 불려요.',
    how_to_read: '전 세계 투자자들이 가장 많이 참고하는 지표예요. 이게 오르면 전 세계 주식 시장 분위기가 좋아져요.',
    caution: '미국 달러 환율의 영향도 함께 받으므로 환율 변화도 같이 체크해야 해요.',
  },
  IXIC: {
    title: '나스닥 (NASDAQ)',
    definition: '애플, 구글, 엔비디아 같은 전 세계 테크 거인들이 모여 있는 시장이에요.',
    how_to_read: '기술주와 성장주 중심이라 금리 변화에 아주 민감하게 반응해요.',
    caution: '변동성이 매우 커서 "하이 리스크 하이 리턴"의 성격이 강해요.',
  },
  FearGreed: {
    title: '공포와 탐욕 지수',
    definition: '투자자들이 지금 얼마나 겁을 먹었는지, 아니면 얼마나 욕심을 내고 있는지 보여주는 심리 지표예요.',
    how_to_read: '0에 가까울수록 "너무 무서워!", 100에 가까울수록 "더 오를 거야!"라는 욕심이 가득한 상태예요.',
    caution: '너무 욕심이 가득할 때(75점 이상)는 오히려 주가가 떨어질 수 있으니 조심해야 한다는 신호일 수 있어요.',
  }
}

export function getIndexOneLiner(name: string, changeRate: number): string {
  if (Math.abs(changeRate) < 0.2) return '보합세, 눈치 보는 중이에요'
  if (changeRate > 1.5) return '대형주 중심으로 아주 힘이 좋아요!'
  if (changeRate > 0) return '전반적으로 상승하는 흐름이에요'
  if (changeRate < -1.5) return '시장이 많이 불안해하고 있어요'
  return '조금씩 하락하며 조정받고 있어요'
}

export function getFearGreedOneLiner(score: number): string {
  if (score <= 25) return '다들 너무 무서워해요. 바닥일 가능성이 있어요'
  if (score <= 45) return '조금 불안한 상태예요. 신중하게 지켜보세요'
  if (score <= 55) return '평온한 상태예요. 큰 움직임이 없네요'
  if (score <= 75) return '수익 기대감이 커지고 있어요. 과열을 주의하세요'
  return '시장 과열! 다들 욕심내고 있으니 정말 조심하세요'
}
