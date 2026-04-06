// @TASK P3-S3-T1 - S3 검색 화면
// 인기 종목: unstable_cache (10분) → lib/data/tickers.ts
import SearchScreen from '@/components/search/SearchScreen'
import { getPopularTickers } from '@/lib/data/tickers'
import type { TickerItem } from '@/components/search/TickerRow'

export default async function SearchPage() {
  const popular = await getPopularTickers()
  return <SearchScreen popularTickers={popular as TickerItem[]} />
}
