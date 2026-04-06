// 뉴스 카드 — 이미지 + AI 헤드라인 + 요약, 가로 스크롤용
import Image from 'next/image'
import ImpactBadge from '@/components/ui/ImpactBadge'

export interface NewsItem {
  id: string | number
  title: string
  ai_headline: string | null
  summary_one_line: string | null
  impact_direction: 'positive' | 'negative' | 'neutral'
  related_tickers: string[]
  source_url: string
  published_at: string
  image_url?: string | null
}

const FALLBACK_COLORS: Record<string, string> = {
  positive: 'bg-green-50',
  negative: 'bg-red-50',
  neutral: 'bg-blue-50',
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const headline = item.ai_headline ?? item.title.slice(0, 30)
  const summary = item.summary_one_line ?? item.title.slice(0, 50)
  const fallbackBg = FALLBACK_COLORS[item.impact_direction] ?? 'bg-gray-50'

  return (
    <a
      href={item.source_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
    >
      {/* 이미지 영역 */}
      <div className={`relative w-full h-36 ${fallbackBg}`}>
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={headline}
            fill
            className="object-cover"
            unoptimized // 외부 이미지 도메인 설정 전 임시
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${fallbackBg}`}>
            <span className="text-3xl">
              {item.impact_direction === 'positive' ? '📈' : item.impact_direction === 'negative' ? '📉' : '📊'}
            </span>
          </div>
        )}
        {/* 임팩트 배지 오버레이 */}
        <div className="absolute top-2 left-2">
          <ImpactBadge direction={item.impact_direction} />
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        {/* AI 헤드라인 */}
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
          {headline}
        </h3>

        {/* 요약 */}
        <p className="text-xs font-light text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {summary}
        </p>

        {/* 관련 종목 + 날짜 */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-wrap gap-1">
            {item.related_tickers.slice(0, 2).map((symbol) => (
              <span
                key={symbol}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium"
              >
                {symbol}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">
            {new Date(item.published_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </a>
  )
}
