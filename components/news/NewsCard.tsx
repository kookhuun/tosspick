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
    <a
      href={item.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
    >
      {/* 임팩트 배지 */}
      <ImpactBadge direction={item.impact_direction} />

      {/* 헤드라인 */}
      <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-3">
        {item.title}
      </h3>

      {/* 세부 요약 */}
      <p className="text-xs font-light text-gray-500 leading-relaxed line-clamp-3 flex-1">
        {item.summary_one_line}
      </p>

      {/* 관련 종목 태그 */}
      {item.related_tickers.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {item.related_tickers.map((symbol) => (
            <span
              key={symbol}
              className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700"
            >
              {symbol}
            </span>
          ))}
        </div>
      )}
    </a>
  )
}
