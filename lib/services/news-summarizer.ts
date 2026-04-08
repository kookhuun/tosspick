// 뉴스 AI 요약 + 헤드라인 생성 — Gemini 1.5 Flash (무료 티어)
// 무료 티어: 하루 1,500회, 분당 15회
// API 키 발급: https://aistudio.google.com/app/apikey

import { GoogleGenerativeAI } from '@google/generative-ai'

export interface NewsSummary {
  ai_headline: string        // AI가 생성한 캐치한 한국어 헤드라인 (30자 이내)
  summary_one_line: string   // 핵심 내용 요약 (50자 이내)
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]  // 관련 종목 코드 최대 3개
}

const PROMPT = (title: string, description: string) => `
다음 뉴스를 분석하여 JSON으로만 응답하세요 (다른 텍스트 없이):
{
  "ai_headline": "독자를 끌어당기는 30자 이내 한국어 헤드라인",
  "summary_one_line": "주가에 미치는 영향 중심으로 50자 이내 요약",
  "impact_direction": "positive 또는 negative 또는 neutral",
  "related_tickers": ["종목코드1", "종목코드2"]
}

제목: ${title}
본문: ${description}
`.trim()

export async function summarizeNews(
  title: string,
  description: string | null
): Promise<NewsSummary> {
  const fallback: NewsSummary = {
    ai_headline: title.slice(0, 30),
    summary_one_line: title.slice(0, 50),
    impact_direction: 'neutral',
    related_tickers: [],
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY 미설정')

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(PROMPT(title, description ?? '(본문 없음)'))
    const response = await result.response
    const text = response.text() ?? ''
    const clean = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()
    const parsed = JSON.parse(clean) as NewsSummary

    if (
      typeof parsed.ai_headline !== 'string' ||
      typeof parsed.summary_one_line !== 'string' ||
      !['positive', 'negative', 'neutral'].includes(parsed.impact_direction) ||
      !Array.isArray(parsed.related_tickers)
    ) {
      return fallback
    }

    return {
      ai_headline: parsed.ai_headline.slice(0, 30),
      summary_one_line: parsed.summary_one_line.slice(0, 50),
      impact_direction: parsed.impact_direction,
      related_tickers: parsed.related_tickers.slice(0, 3),
    }
  } catch {
    return fallback
  }
}
