// @TASK P2-R1-T1 - Claude API로 AI 요약
// @SPEC docs/planning/02-trd.md#AI-요약

import Anthropic from '@anthropic-ai/sdk'

export interface NewsSummary {
  summary_one_line: string
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]
}

const SYSTEM_PROMPT = `뉴스 제목과 본문을 분석하여 JSON으로만 응답하세요 (다른 텍스트 없이):
{
  "summary_one_line": "50자 이내 한국어 요약",
  "impact_direction": "positive|negative|neutral",
  "related_tickers": ["005930", "AAPL"] // 최대 3개, 없으면 빈 배열
}`

/**
 * 뉴스 제목과 본문을 AI로 요약합니다.
 */
export async function summarizeNews(
  title: string,
  description: string | null
): Promise<NewsSummary> {
  const fallback: NewsSummary = {
    summary_one_line: title.slice(0, 50),
    impact_direction: 'neutral',
    related_tickers: [],
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `제목: ${title}\n본문: ${description ?? '(본문 없음)'}`,
        },
      ],
      system: SYSTEM_PROMPT,
    })

    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return fallback
    }

    const parsed = JSON.parse(textBlock.text) as NewsSummary

    // 유효성 검증
    if (
      typeof parsed.summary_one_line !== 'string' ||
      !['positive', 'negative', 'neutral'].includes(parsed.impact_direction) ||
      !Array.isArray(parsed.related_tickers)
    ) {
      return fallback
    }

    return {
      summary_one_line: parsed.summary_one_line.slice(0, 50),
      impact_direction: parsed.impact_direction,
      related_tickers: parsed.related_tickers.slice(0, 3),
    }
  } catch {
    return fallback
  }
}
