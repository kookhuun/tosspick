// 뉴스 AI 요약 — Gemini 1.5 Flash 사용
// 무료 티어: 하루 1,500회, 분당 15회 (뉴스 갱신에 충분)
// API 키: https://aistudio.google.com/app/apikey 에서 무료 발급

import { GoogleGenAI } from '@google/genai'

export interface NewsSummary {
  summary_one_line: string
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]
}

const PROMPT_TEMPLATE = (title: string, description: string) => `
뉴스 제목과 본문을 분석하여 JSON으로만 응답하세요 (다른 텍스트 없이):
{
  "summary_one_line": "50자 이내 한국어 요약",
  "impact_direction": "positive 또는 negative 또는 neutral",
  "related_tickers": ["005930", "AAPL"]
}

제목: ${title}
본문: ${description}
`.trim()

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
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY 미설정')

    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: PROMPT_TEMPLATE(title, description ?? '(본문 없음)'),
    })

    const text = response.text?.trim() ?? ''
    // ```json ... ``` 블록 제거
    const clean = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()
    const parsed = JSON.parse(clean) as NewsSummary

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
