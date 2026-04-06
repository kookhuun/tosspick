// @TASK T-TRADING - GBM 기반 랜덤 차트 생성기

export interface CandleData {
  time: number // unix timestamp (ms)
  open: number
  high: number
  low: number
  close: number
  volume: number
}

const DRIFT = 0.0001
const VOLATILITY = 0.015
const CANDLE_INTERVAL_MS = 60 * 1000 // 1분봉

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

/** Box-Muller 변환으로 정규분포 난수 생성 */
function normalRandom(rng: () => number): number {
  const u1 = Math.max(1e-10, rng())
  const u2 = rng()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function gbmStep(prevClose: number, rng: () => number): number {
  const z = normalRandom(rng)
  // 가끔 큰 변동 (5% 확률로 변동성 3배)
  const spike = rng() < 0.05 ? 3 : 1
  const drift = DRIFT - 0.5 * VOLATILITY * VOLATILITY
  const diffusion = VOLATILITY * spike * z
  return prevClose * Math.exp(drift + diffusion)
}

function buildCandle(open: number, close: number, rng: () => number, time: number): CandleData {
  const priceRange = Math.abs(close - open)
  const wick = priceRange * (0.3 + rng() * 0.7)

  const high = Math.max(open, close) + wick * rng()
  const low = Math.min(open, close) - wick * rng()

  // 거래량: 변동폭 비례 + 랜덤
  const changeRatio = priceRange / open
  const baseVolume = 10_000 + Math.floor(rng() * 50_000)
  const volume = Math.floor(baseVolume * (1 + changeRatio * 20))

  return {
    time,
    open: Math.round(open * 100) / 100,
    high: Math.round(high * 100) / 100,
    low: Math.round(low * 100) / 100,
    close: Math.round(close * 100) / 100,
    volume,
  }
}

export function generateInitialCandles(count: number, basePrice: number): CandleData[] {
  const seed = Math.floor(Math.random() * 999999)
  const rng = seededRandom(seed)
  const candles: CandleData[] = []

  const now = Date.now()
  const startTime = now - count * CANDLE_INTERVAL_MS

  let prevClose = basePrice

  for (let i = 0; i < count; i++) {
    const open = prevClose
    const close = gbmStep(open, rng)
    const time = startTime + i * CANDLE_INTERVAL_MS
    candles.push(buildCandle(open, close, rng, time))
    prevClose = close
  }

  return candles
}

export function generateNextCandle(prevCandle: CandleData): CandleData {
  const rng = seededRandom(Math.floor(Math.random() * 999999))
  const open = prevCandle.close
  const close = gbmStep(open, rng)
  const time = prevCandle.time + CANDLE_INTERVAL_MS
  return buildCandle(open, close, rng, time)
}
