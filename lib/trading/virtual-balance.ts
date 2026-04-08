// 투자 훈련 시스템용 데이터 관리 (Local Storage 기반)

export interface VirtualBalance {
  cash: number
  total_invested: number
  level: '초보' | '중수' | '고수'
  exp: number
  last_attendance: string | null
  completed_missions: string[]
}

export interface Position {
  symbol: string
  name: string
  quantity: number
  avg_price: number
  current_price: number
}

export interface TradeHistory {
  id: string
  symbol: string
  name: string
  type: 'buy' | 'sell'
  quantity: number
  price: number
  date: string
  reason?: string        // 산 이유
  strategy?: 'short' | 'long' // 단타/장투
  rating?: number       // 스스로의 평가 (1-5)
}

const STORAGE_KEY = 'tosspick_virtual_trading_v2'

const DEFAULT_BALANCE: VirtualBalance = {
  cash: 10000000, // 1000만원 기본 지급
  total_invested: 0,
  level: '초보',
  exp: 0,
  last_attendance: null,
  completed_missions: [],
}

export function getBalance(): VirtualBalance {
  if (typeof window === 'undefined') return DEFAULT_BALANCE
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return DEFAULT_BALANCE
  try {
    return JSON.parse(saved)
  } catch {
    return DEFAULT_BALANCE
  }
}

export function saveBalance(balance: VirtualBalance) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(balance))
}

export function addExp(amount: number) {
  const balance = getBalance()
  balance.exp += amount
  
  // 레벨업 로직
  if (balance.exp >= 1000 && balance.level === '초보') {
    balance.level = '중수'
  } else if (balance.exp >= 5000 && balance.level === '중수') {
    balance.level = '고수'
  }
  
  saveBalance(balance)
}

export function getPositions(): Position[] {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem(`${STORAGE_KEY}_positions`)
  return saved ? JSON.parse(saved) : []
}

export function getHistory(): TradeHistory[] {
  if (typeof window === 'undefined') return []
  const saved = localStorage.getItem(`${STORAGE_KEY}_history`)
  return saved ? JSON.parse(saved) : []
}

export function recordTrade(history: TradeHistory) {
  const current = getHistory()
  localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify([history, ...current]))
  
  // 매매 기록 시 경험치 증정 (훈련의 일부)
  addExp(50)
}

export function buyStock(symbol: string, name: string, price: number, quantity: number): boolean {
  const balance = getBalance()
  const totalCost = price * quantity
  if (balance.cash < totalCost) return false

  balance.cash -= totalCost
  balance.total_invested += totalCost
  saveBalance(balance)

  recordTrade({
    id: Math.random().toString(36).substr(2, 9),
    symbol,
    name,
    type: 'buy',
    quantity,
    price,
    date: new Date().toISOString(),
    reason: '랜덤 차트 훈련 매수'
  })
  return true
}

export function sellStock(symbol: string, price: number, quantity: number): boolean {
  // 간단 구현: 현재는 잔고 체크 없이 매도 처리 (훈련용)
  const balance = getBalance()
  const totalGain = price * quantity
  balance.cash += totalGain
  balance.total_invested -= totalGain // 단순화된 로직
  saveBalance(balance)

  recordTrade({
    id: Math.random().toString(36).substr(2, 9),
    symbol,
    name: '랜덤 종목 매도',
    type: 'sell',
    quantity,
    price,
    date: new Date().toISOString(),
    reason: '랜덤 차트 훈련 매도'
  })
  return true
}

export function claimAdReward(): boolean {
  addExp(100) // 광고 대신 '훈련 영상 시청'으로 경험치 지급
  return true
}

export function getAdCooldown(): number {
  return 0 // 쿨타임 없음
}

export function checkAndClaimAttendance(): { claimed: boolean } {
  addExp(300) // 출석 대신 '데일리 훈련' 경험치 지급
  return { claimed: true }
}

export function getAttendanceStatus() {
  const b = getBalance()
  return { 
    is_claimed: b.last_attendance === new Date().toISOString().split('T')[0],
    last_attendance: b.last_attendance
  }
}
