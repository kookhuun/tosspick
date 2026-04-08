// @TASK P3-S4-T1, P3-S4-T2, P4-회사분석 - 종목 상세 화면 (3탭 구조)
// 종목 데이터: unstable_cache (5분) → lib/data/tickers.ts
import { notFound } from 'next/navigation'
import StockHeader from '@/components/stock/StockHeader'
import PriceChart from '@/components/stock/PriceChart'
import StockTabs from '@/components/stock/StockTabs'
import { getTickerDetail, getTickerNews } from '@/lib/data/tickers'
import type { TickerData } from '@/components/stock/StockHeader'
import type { TickerDetailData } from '@/components/stock/KeyIndicators'
import type { NewsItem } from '@/components/stock/RelatedNews'

interface PageProps {
  params: Promise<{ symbol: string }>
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params
  const [stockData, newsData] = await Promise.all([
    getTickerDetail(symbol),
    getTickerNews(symbol),
  ])

  if (!stockData) notFound()

  const { ticker, detail } = stockData

  const tabDetail: TickerDetailData & {
    per?: number | null
    pbr?: number | null
    eps?: number | null
  } = {
    per: detail?.per ?? null,
    pbr: detail?.pbr ?? null,
    eps: detail?.eps ?? null,
    dividend_rate: detail?.dividend_rate ?? null,
    market_cap: (ticker as any).market_cap,
    volume: (ticker as any).volume,
  }

  return (
    <main className="flex flex-col pb-24 bg-gray-50 min-h-screen">
      {/* StockHeader: 탭 밖에 항상 표시 */}
      <StockHeader
        ticker={ticker as TickerData}
        isLoggedIn={false} // TODO P4: 세션에서 주입
      />

      {/* 차트: 탭 밖에 항상 표시 */}
      <div className="px-3 pt-3">
        <PriceChart chartData={(detail?.chart_data as Record<string, unknown>) ?? {}} />
      </div>

      {/* 3탭 영역 */}
      <div className="mt-3">
        <StockTabs
          ticker={ticker as TickerData}
          detail={tabDetail}
          news={newsData as NewsItem[]}
          symbol={ticker.symbol}
        />
      </div>

    </main>
  )
}
