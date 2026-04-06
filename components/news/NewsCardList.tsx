// @TASK P2-S1-T1
import NewsCard, { type NewsItem } from './NewsCard'

export default function NewsCardList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
        뉴스가 없습니다.
      </div>
    )
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  )
}
