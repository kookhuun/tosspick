// @TASK P3-R2-T2 - POST /api/tickers/[symbol]/ai-analysis (AI 인과 분석)
// @SPEC docs/planning/06-tasks.md#P3-R2-T2

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const CACHE_TTL_HOURS = 6

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params
    const supabase = await createClient()

    // ticker 조회
    const { data: ticker, error: tickerError } = await supabase
      .from('tickers')
      .select('id, symbol, name, market, current_price, price_change_rate')
      .eq('symbol', symbol.toUpperCase())
      .single()

    if (tickerError || !ticker) {
      return NextResponse.json({ error: '종목을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 캐시 확인: 6시간 이내 분석 결과가 있으면 재사용
    const { data: existing } = await supabase
      .from('ticker_details')
      .select('ai_earnings_summary, ai_opinion, ai_opinion_reason, ai_causal_story, ai_analyzed_at')
      .eq('ticker_id', ticker.id)
      .single()

    if (existing?.ai_analyzed_at) {
      const analyzedAt = new Date(existing.ai_analyzed_at)
      const hoursDiff = (Date.now() - analyzedAt.getTime()) / (1000 * 60 * 60)
      if (hoursDiff < CACHE_TTL_HOURS && existing.ai_causal_story) {
        return NextResponse.json({
          cached: true,
          analysis: {
            ai_earnings_summary: existing.ai_earnings_summary,
            ai_opinion: existing.ai_opinion,
            ai_opinion_reason: existing.ai_opinion_reason,
            ai_causal_story: existing.ai_causal_story,
          },
        })
      }
    }

    // 관련 뉴스 조회 (최근 5개)
    const { data: news } = await supabase
      .from('news_items')
      .select('title, summary_one_line, impact_direction')
      .contains('related_tickers', [ticker.symbol])
      .order('published_at', { ascending: false })
      .limit(5)

    const newsText = (news ?? [])
      .map((n) => `- ${n.title}${n.summary_one_line ? ` (${n.summary_one_line})` : ''}`)
      .join('\n')

    const prompt = `종목 ${ticker.name}(${ticker.symbol})의 최근 뉴스와 지표를 분석하여 JSON으로 응답하세요.

현재가: ${ticker.current_price}원, 변동률: ${ticker.price_change_rate}%
최근 뉴스:
${newsText || '관련 뉴스 없음'}

다음 JSON 형식으로만 응답하세요 (마크다운 없이):
{
  "ai_earnings_summary": "최근 실적/이슈 50자 이내 요약",
  "ai_opinion": "buy_consider | caution | hold 중 하나",
  "ai_opinion_reason": ["근거1 30자 이내", "근거2 30자 이내"],
  "ai_causal_story": "이 사건→이런 영향→앞으로 이럴 수 있다 형식의 인과 분석 100자 이내"
}`

    const client = new Anthropic()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const analysis = JSON.parse(text)

    // upsert into ticker_details
    await supabase.from('ticker_details').upsert({
      ticker_id: ticker.id,
      ai_earnings_summary: analysis.ai_earnings_summary,
      ai_opinion: analysis.ai_opinion,
      ai_opinion_reason: analysis.ai_opinion_reason,
      ai_causal_story: analysis.ai_causal_story,
      ai_analyzed_at: new Date().toISOString(),
    })

    return NextResponse.json({ cached: false, analysis })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
