// @TASK P2-S1-T1
import NewsCard, { type NewsItem } from './NewsCard'

export default function NewsCardList({ items }: { items: NewsItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p>뉴스가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  )
}
