// @TASK P4-커뮤니티 - 실시간 HOT 종목 섹션
// DB 연결 시 외부에서 데이터를 주입, 빈 배열이면 빈 상태 UI 표시

interface HotTicker {
  symbol: string
  ticker_name: string
  post_count: number
}

interface HotTickersProps {
  tickers: HotTicker[]
}

export default function HotTickers({ tickers }: HotTickersProps) {
  return (
    <section className="bg-white border-b border-gray-100 px-4 py-3">
      <h2 className="text-sm font-bold text-gray-900 mb-2.5">
        <span aria-hidden="true">🔥</span> 실시간 HOT 종목
      </h2>

      {tickers.length === 0 ? (
        <p className="text-xs text-gray-400 py-1">아직 핫한 종목이 없습니다</p>
      ) : (
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          role="list"
          aria-label="핫 종목 목록"
        >
          {tickers.map((t) => (
            <a
              key={t.symbol}
              href={`/community/${t.symbol}`}
              role="listitem"
              className="flex-shrink-0 flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-full px-3 py-1.5 hover:bg-orange-100 transition-colors"
            >
              <span className="text-xs font-semibold text-orange-700">{t.symbol}</span>
              <span className="text-xs text-orange-500">{t.ticker_name}</span>
              <span className="text-xs text-orange-400">·{t.post_count}</span>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
