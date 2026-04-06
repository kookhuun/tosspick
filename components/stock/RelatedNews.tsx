// @TASK P3-S4-T2 - 관련 뉴스 목록
// NOTE: news_items 테이블에서 related_tickers 배열로 조회.
//       외부 툴이 NewsAPI → Claude 요약 → DB 저장 구조.

export interface NewsItem {
  id: string
  title: string
  summary_one_line: string | null
  impact_direction: 'positive' | 'negative' | 'neutral' | null
  published_at: string
  source_url: string
}

interface RelatedNewsProps {
  news: NewsItem[]
}

const IMPACT_STYLE: Record<string, string> = {
  positive: 'text-green-600',
  negative: 'text-red-500',
  neutral: 'text-gray-400',
}

export default function RelatedNews({ news }: RelatedNewsProps) {
  if (news.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">관련 뉴스</h3>
        <p className="text-sm text-gray-400">관련 뉴스가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <h3 className="text-sm font-semibold text-gray-700 px-4 pt-4 pb-2">관련 뉴스</h3>
      <ul className="divide-y divide-gray-50">
        {news.map((item) => (
          <li key={item.id}>
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm text-gray-900 line-clamp-2">{item.title}</span>
              {item.summary_one_line && (
                <span className={`text-xs font-medium ${IMPACT_STYLE[item.impact_direction ?? 'neutral']}`}>
                  {item.summary_one_line}
                </span>
              )}
              <span className="text-[10px] text-gray-400">
                {new Date(item.published_at).toLocaleDateString('ko-KR')}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
