// 실시간 모의 차트 엔진 (Random Walk)

export interface CandleData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// 초기 데이터 생성 (과거 흐름)
export function generateInitialCandles(count: number, basePrice: number): CandleData[] {
  let lastClose = basePrice
  const data: CandleData[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.02)
    const open = lastClose
    const close = open + change
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.005)
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.005)
    
    data.push({
      time: new Date(now - (count - i) * 60000).toLocaleTimeString(),
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000) + 100
    })
    lastClose = close
  }
  return data
}

// 실시간 미세 변동 (Tick) 생성
export function generateNextTick(lastCandle: CandleData): CandleData {
  const volatility = 0.002 // 0.2% 변동성
  const change = (Math.random() - 0.48) * (lastCandle.close * volatility) // 약간의 우상향 편향
  const newClose = lastCandle.close + change
  
  return {
    ...lastCandle,
    high: Math.max(lastCandle.high, newClose),
    low: Math.min(lastCandle.low, newClose),
    close: newClose,
    volume: lastCandle.volume + Math.floor(Math.random() * 10)
  }
}
