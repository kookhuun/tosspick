// RSS 피드에서 한국 금융/경제 뉴스 수집 (무료, API 키 불필요)
import Parser from 'rss-parser'

export interface RawNewsItem {
  title: string
  description: string | null
  url: string
  publishedAt: string
}

const RSS_FEEDS = [
  { name: '한국경제', url: 'https://www.hankyung.com/feed/all-news' },
  { name: '연합뉴스 경제', url: 'https://www.yna.co.kr/RSS/economy.xml' },
  { name: '매일경제', url: 'https://www.mk.co.kr/rss/40300001/' },
]

const parser = new Parser({
  timeout: 8000,
  headers: { 'User-Agent': 'TossPick/1.0' },
})

/**
 * 여러 RSS 피드에서 뉴스를 수집합니다.
 * @param limitPerFeed 피드당 최대 기사 수 (기본 7)
 */
export async function collectNewsFromRSS(limitPerFeed = 7): Promise<RawNewsItem[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map((feed) => parser.parseURL(feed.url))
  )

  const items: RawNewsItem[] = []

  for (const result of results) {
    if (result.status === 'rejected') continue

    const feedItems = result.value.items.slice(0, limitPerFeed)
    for (const item of feedItems) {
      if (!item.title || !item.link) continue
      items.push({
        title: item.title.trim(),
        description: item.contentSnippet?.trim() ?? item.summary?.trim() ?? null,
        url: item.link,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      })
    }
  }

  return items
}
