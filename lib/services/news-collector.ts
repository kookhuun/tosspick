// @TASK P2-R1-T1 - NewsAPI 호출 서비스
// @SPEC docs/planning/02-trd.md#뉴스-수집

export interface RawNewsItem {
  title: string
  description: string | null
  url: string
  publishedAt: string
  source: { name: string }
}

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: RawNewsItem[]
}

/**
 * NewsAPI에서 한국 주식 관련 뉴스를 수집합니다.
 * @param pageSize 가져올 뉴스 개수 (기본 10, 최대 100)
 */
export async function collectNews(pageSize = 10): Promise<RawNewsItem[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    throw new Error('NEWS_API_KEY 환경변수가 설정되지 않았습니다.')
  }

  const url = new URL('https://newsapi.org/v2/everything')
  url.searchParams.set('q', 'stock market korea')
  url.searchParams.set('language', 'ko')
  url.searchParams.set('pageSize', String(Math.min(pageSize, 100)))
  url.searchParams.set('apiKey', apiKey)

  try {
    const response = await fetch(url.toString(), {
      headers: { 'User-Agent': 'TossPick/1.0' },
    })

    if (!response.ok) {
      throw new Error(`NewsAPI 응답 오류: ${response.status} ${response.statusText}`)
    }

    const data: NewsAPIResponse = await response.json()

    if (data.status !== 'ok') {
      throw new Error(`NewsAPI 상태 오류: ${data.status}`)
    }

    return data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: { name: article.source.name },
    }))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`뉴스 수집 실패: ${error.message}`)
    }
    throw new Error('뉴스 수집 중 알 수 없는 오류가 발생했습니다.')
  }
}
