// @TASK T-TRADING - 가상 잔고 시스템 (localStorage 기반)

export interface VirtualBalance {
  cash: number
  total_invested: number
  last_attendance: string | null
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
  total: number
  timestamp: string
}

const KEYS = {
  BALANCE: 'vb_balance',
  POSITIONS: 'vb_positions',
  HISTORY: 'vb_history',
  AD_COOLDOWN: 'vb_ad_cooldown',
} as const

const INITIAL_BALANCE: VirtualBalance = {
  cash: 1_000_000,
  total_invested: 0,
  last_attendance: null,
}

function isClient(): boolean {
  return typeof window !== 'undefined'
}

export function getBalance(): VirtualBalance {
  if (!isClient()) return { ...INITIAL_BALANCE }
  try {
    const raw = localStorage.getItem(KEYS.BALANCE)
    if (!raw) {
      localStorage.setItem(KEYS.BALANCE, JSON.stringify(INITIAL_BALANCE))
      return { ...INITIAL_BALANCE }
    }
    return JSON.parse(raw) as VirtualBalance
  } catch {
    return { ...INITIAL_BALANCE }
  }
}

function saveBalance(balance: VirtualBalance): void {
  if (!isClient()) return
  localStorage.setItem(KEYS.BALANCE, JSON.stringify(balance))
}

export function addCash(amount: number, _reason: string): void {
  if (!isClient()) return
  const balance = getBalance()
  balance.cash += amount
  saveBalance(balance)
}

export function getPositions(): Position[] {
  if (!isClient()) return []
  try {
    const raw = localStorage.getItem(KEYS.POSITIONS)
    if (!raw) return []
    return JSON.parse(raw) as Position[]
  } catch {
    return []
  }
}

function savePositions(positions: Position[]): void {
  if (!isClient()) return
  localStorage.setItem(KEYS.POSITIONS, JSON.stringify(positions))
}

export function getHistory(): TradeHistory[] {
  if (!isClient()) return []
  try {
    const raw = localStorage.getItem(KEYS.HISTORY)
    if (!raw) return []
    return JSON.parse(raw) as TradeHistory[]
  } catch {
    return []
  }
}

function addHistory(entry: Omit<TradeHistory, 'id' | 'timestamp'>): void {
  if (!isClient()) return
  const history = getHistory()
  const newEntry: TradeHistory = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  }
  history.unshift(newEntry)
  // 최대 200개 유지
  if (history.length > 200) history.splice(200)
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history))
}

export function buyStock(
  symbol: string,
  name: string,
  price: number,
  quantity: number
): boolean {
  if (!isClient()) return false
  const total = price * quantity
  const balance = getBalance()
  if (balance.cash < total) return false

  // 잔고 차감
  balance.cash -= total
  balance.total_invested += total
  saveBalance(balance)

  // 포지션 업데이트 (평균단가 계산)
  const positions = getPositions()
  const existing = positions.find((p) => p.symbol === symbol)
  if (existing) {
    const prevTotal = existing.avg_price * existing.quantity
    existing.quantity += quantity
    existing.avg_price = (prevTotal + total) / existing.quantity
    existing.current_price = price
  } else {
    positions.push({ symbol, name, quantity, avg_price: price, current_price: price })
  }
  savePositions(positions)

  addHistory({ symbol, name, type: 'buy', quantity, price, total })
  return true
}

export function sellStock(
  symbol: string,
  price: number,
  quantity: number
): boolean {
  if (!isClient()) return false
  const positions = getPositions()
  const idx = positions.findIndex((p) => p.symbol === symbol)
  if (idx === -1) return false

  const position = positions[idx]
  if (position.quantity < quantity) return false

  const total = price * quantity
  const costBasis = position.avg_price * quantity

  // 잔고 증가
  const balance = getBalance()
  balance.cash += total
  balance.total_invested = Math.max(0, balance.total_invested - costBasis)
  saveBalance(balance)

  // 포지션 업데이트
  position.quantity -= quantity
  if (position.quantity === 0) {
    positions.splice(idx, 1)
  } else {
    position.current_price = price
  }
  savePositions(positions)

  addHistory({ symbol, name: position.name, type: 'sell', quantity, price, total })
  return true
}

export function updatePositionPrice(symbol: string, price: number): void {
  if (!isClient()) return
  const positions = getPositions()
  const pos = positions.find((p) => p.symbol === symbol)
  if (pos) {
    pos.current_price = price
    savePositions(positions)
  }
}

export function checkAndClaimAttendance(): { claimed: boolean; amount: number } {
  if (!isClient()) return { claimed: false, amount: 0 }
  const balance = getBalance()
  const today = new Date().toISOString().slice(0, 10)

  if (balance.last_attendance === today) {
    return { claimed: false, amount: 0 }
  }

  const amount = 300_000
  balance.cash += amount
  balance.last_attendance = today
  saveBalance(balance)
  return { claimed: true, amount }
}

export function getAdCooldown(): number {
  if (!isClient()) return 0
  try {
    const raw = localStorage.getItem(KEYS.AD_COOLDOWN)
    if (!raw) return 0
    const last = parseInt(raw, 10)
    const elapsed = Date.now() - last
    const cooldown = 60 * 60 * 1000 // 1시간
    return Math.max(0, cooldown - elapsed)
  } catch {
    return 0
  }
}

export function claimAdReward(): boolean {
  if (!isClient()) return false
  if (getAdCooldown() > 0) return false
  localStorage.setItem(KEYS.AD_COOLDOWN, Date.now().toString())
  addCash(100_000, '광고시청')
  return true
}
