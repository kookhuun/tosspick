// RSS + Google News에서 주식 관련 뉴스 수집 (무료, API 키 불필요)
import Parser from 'rss-parser'

type FeedItem = {
  title?: string
  link?: string
  pubDate?: string
  contentSnippet?: string
  summary?: string
  enclosure?: { url?: string }
  'media:content'?: { $?: { url?: string } }
  'media:thumbnail'?: { $?: { url?: string } }
}

export interface RawNewsItem {
  title: string
  description: string | null
  url: string
  publishedAt: string
  imageUrl: string | null
}

const RSS_FEEDS = [
  // Google News — 주식/증시 관련 (이미지 포함 가능성 높음)
  {
    name: 'Google News 증시',
    url: 'https://news.google.com/rss/search?q=한국+증시+주식&hl=ko&gl=KR&ceid=KR:ko',
  },
  {
    name: 'Google News 코스피',
    url: 'https://news.google.com/rss/search?q=코스피+코스닥+주가&hl=ko&gl=KR&ceid=KR:ko',
  },
  // 국내 경제지 RSS
  { name: '한국경제', url: 'https://www.hankyung.com/feed/all-news' },
  { name: '연합뉴스 경제', url: 'https://www.yna.co.kr/RSS/economy.xml' },
]

const parser = new Parser<Record<string, unknown>, FeedItem>({
  timeout: 8000,
  headers: { 'User-Agent': 'TossPick/1.0' },
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
    ],
  },
})

function extractImage(item: FeedItem): string | null {
  // 1. media:thumbnail
  const thumb = item['media:thumbnail']
  if (thumb?.$?.url) return thumb.$.url

  // 2. media:content
  const media = item['media:content']
  if (media?.$?.url) return media.$.url

  // 3. enclosure
  if (item.enclosure?.url) return item.enclosure.url

  return null
}

/**
 * 여러 RSS/Google News 피드에서 주식 관련 뉴스를 수집합니다.
 */
export async function collectNewsFromRSS(limitPerFeed = 6): Promise<RawNewsItem[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map((feed) => parser.parseURL(feed.url))
  )

  const seen = new Set<string>()
  const items: RawNewsItem[] = []

  for (const result of results) {
    if (result.status === 'rejected') continue

    for (const item of result.value.items.slice(0, limitPerFeed)) {
      if (!item.title || !item.link) continue
      if (seen.has(item.link)) continue
      seen.add(item.link)

      items.push({
        title: item.title.trim(),
        description: item.contentSnippet?.trim() ?? item.summary?.trim() ?? null,
        url: item.link,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        imageUrl: extractImage(item),
      })
    }
  }

  return items
}
