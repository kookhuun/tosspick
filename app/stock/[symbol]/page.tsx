// @TASK P3-S4-T1, P3-S4-T2 - S4 종목 상세 화면
// 종목 데이터: unstable_cache (5분) → lib/data/tickers.ts
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StockHeader from '@/components/stock/StockHeader'
import PriceChart from '@/components/stock/PriceChart'
import KeyIndicators from '@/components/stock/KeyIndicators'
import AICausalAnalysis from '@/components/stock/AICausalAnalysis'
import RelatedNews from '@/components/stock/RelatedNews'
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

  return (
    <main className="flex flex-col gap-3 pb-24 bg-gray-50 min-h-screen">
      <StockHeader
        ticker={ticker as TickerData}
        isLoggedIn={false} // TODO P4: 세션에서 주입
      />
      <div className="flex flex-col gap-3 px-3">
        <PriceChart chartData={(detail?.chart_data as Record<string, unknown>) ?? {}} />
        <KeyIndicators
          detail={{
            per: detail?.per ?? null,
            pbr: detail?.pbr ?? null,
            eps: detail?.eps ?? null,
            dividend_rate: detail?.dividend_rate ?? null,
            market_cap: ticker.market_cap,
            volume: ticker.volume,
          } as TickerDetailData}
        />
        <AICausalAnalysis
          symbol={ticker.symbol}
          aiCausalStory={detail?.ai_causal_story ?? null}
          aiEarningsSummary={detail?.ai_earnings_summary ?? null}
          aiOpinion={(detail?.ai_opinion as 'buy_consider' | 'caution' | 'hold' | null) ?? null}
          aiOpinionReason={detail?.ai_opinion_reason ?? null}
          analyzedAt={detail?.ai_analyzed_at ?? null}
        />
        <RelatedNews news={newsData as NewsItem[]} />
        <Link
          href={`/community?symbol=${ticker.symbol}`}
          className="flex items-center justify-center py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          {ticker.name} 커뮤니티 보기 →
        </Link>
      </div>
    </main>
  )
}
