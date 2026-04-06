// 해외주식 섹터 히트맵 (finviz 스타일)
// NOTE: 외부 툴이 tickers(market=NYSE/NASDAQ, sector=...) 데이터 갱신 담당

export interface HeatmapTicker {
  symbol: string
  name: string
  change_rate: number
  market_cap: number // 셀 크기 비례용
}

export interface SectorGroup {
  name: string
  tickers: HeatmapTicker[]
}

function cellColor(rate: number): string {
  if (rate >= 3) return 'bg-green-700'
  if (rate >= 1.5) return 'bg-green-500'
  if (rate >= 0.5) return 'bg-green-400'
  if (rate >= 0) return 'bg-green-200'
  if (rate >= -0.5) return 'bg-red-200'
  if (rate >= -1.5) return 'bg-red-400'
  if (rate >= -3) return 'bg-red-500'
  return 'bg-red-700'
}

function textColor(rate: number): string {
  const abs = Math.abs(rate)
  return abs >= 0.5 ? 'text-white' : 'text-gray-700'
}

function TickerCell({ ticker }: { ticker: HeatmapTicker }) {
  const bg = cellColor(ticker.change_rate)
  const text = textColor(ticker.change_rate)
  const sign = ticker.change_rate >= 0 ? '+' : ''

  return (
    <a
      href={`/stock/${ticker.symbol}`}
      title={ticker.name}
      className={`${bg} ${text} rounded flex flex-col items-center justify-center p-1 min-h-[52px] hover:opacity-80 transition-opacity`}
    >
      <span className="text-[11px] font-bold leading-tight">{ticker.symbol}</span>
      <span className="text-[10px] font-light leading-tight">
        {sign}{ticker.change_rate.toFixed(2)}%
      </span>
    </a>
  )
}

interface OverseasHeatmapProps {
  sectors: SectorGroup[]
}

export default function OverseasHeatmap({ sectors }: OverseasHeatmapProps) {
  if (sectors.length === 0) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-400">
        해외 종목 데이터가 없습니다.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {sectors.map((sector) => (
        <div key={sector.name} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            {sector.name}
          </h3>
          <div className="grid grid-cols-4 gap-1.5">
            {sector.tickers.map((ticker) => (
              <TickerCell key={ticker.symbol} ticker={ticker} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
