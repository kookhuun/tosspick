// @TASK P3-S4-T1, P3-S4-T2 - S4 종목 상세 화면
// NOTE: 서버 컴포넌트. ticker + ticker_detail + 관련 뉴스 조회.
//       데이터 갱신은 외부 툴 담당 (tickers, ticker_details, news_items 테이블 직접 upsert).

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StockHeader, { type TickerData } from '@/components/stock/StockHeader'
import PriceChart from '@/components/stock/PriceChart'
import KeyIndicators, { type TickerDetailData } from '@/components/stock/KeyIndicators'
import AICausalAnalysis from '@/components/stock/AICausalAnalysis'
import RelatedNews, { type NewsItem } from '@/components/stock/RelatedNews'

interface PageProps {
  params: Promise<{ symbol: string }>
}

async function getStockData(symbol: string) {
  const supabase = await createClient()

  const { data: ticker, error } = await supabase
    .from('tickers')
    .select('id, symbol, name, market, current_price, price_change, price_change_rate, volume, market_cap')
    .eq('symbol', symbol.toUpperCase())
    .single()

  if (error || !ticker) return null

  const [detailRes, newsRes] = await Promise.allSettled([
    supabase
      .from('ticker_details')
      .select('per, pbr, eps, dividend_rate, chart_data, ai_earnings_summary, ai_opinion, ai_opinion_reason, ai_causal_story, next_earnings_date, ai_analyzed_at')
      .eq('ticker_id', ticker.id)
      .single(),
    supabase
      .from('news_items')
      .select('id, title, summary_one_line, impact_direction, published_at, source_url')
      .contains('related_tickers', [ticker.symbol])
      .order('published_at', { ascending: false })
      .limit(5),
  ])

  const detail = detailRes.status === 'fulfilled' ? (detailRes.value.data ?? null) : null
  const news: NewsItem[] = newsRes.status === 'fulfilled' ? (newsRes.value.data ?? []) : []

  return { ticker, detail, news }
}

export default async function StockPage({ params }: PageProps) {
  const { symbol } = await params
  const data = await getStockData(symbol)

  if (!data) notFound()

  const { ticker, detail, news } = data

  return (
    <main className="flex flex-col gap-3 pb-24 bg-gray-50 min-h-screen">
      {/* 종목 헤더 */}
      <StockHeader
        ticker={ticker as TickerData}
        isLoggedIn={false} // TODO P4: 세션에서 로그인 상태 주입
      />

      <div className="flex flex-col gap-3 px-3">
        {/* 주가 차트 */}
        <PriceChart chartData={(detail?.chart_data as Record<string, unknown>) ?? {}} />

        {/* 기본 지표 */}
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

        {/* AI 인과 분석 */}
        <AICausalAnalysis
          symbol={ticker.symbol}
          aiCausalStory={detail?.ai_causal_story ?? null}
          aiEarningsSummary={detail?.ai_earnings_summary ?? null}
          aiOpinion={(detail?.ai_opinion as 'buy_consider' | 'caution' | 'hold' | null) ?? null}
          aiOpinionReason={detail?.ai_opinion_reason ?? null}
          analyzedAt={detail?.ai_analyzed_at ?? null}
        />

        {/* 관련 뉴스 */}
        <RelatedNews news={news} />

        {/* 커뮤니티 바로가기 */}
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
