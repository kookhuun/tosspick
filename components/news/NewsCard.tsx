// @TASK P2-S1-T1
import ImpactBadge from '@/components/ui/ImpactBadge'

export interface NewsItem {
  id: number
  title: string
  summary_one_line: string
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]
  source_url: string
  published_at: string
}

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
          {item.title}
        </h3>
        <ImpactBadge direction={item.impact_direction} />
      </div>

      <p className="text-sm text-gray-700 font-medium mb-3">{item.summary_one_line}</p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {item.related_tickers.map((symbol) => (
            <a
              key={symbol}
              href={`/stock/${symbol}`}
              className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {symbol}
            </a>
          ))}
        </div>
        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          원문 보기
        </a>
      </div>
    </article>
  )
}
