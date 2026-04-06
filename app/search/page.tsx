// @TASK P3-S3-T1 - S3 검색 화면
// NOTE: 검색은 Client Component (debounce input). 인기 종목은 Server Component에서 prefetch.

import { createClient } from '@/lib/supabase/server'
import SearchScreen from '@/components/search/SearchScreen'
import type { TickerItem } from '@/components/search/TickerRow'

async function getPopularTickers(): Promise<TickerItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tickers')
    .select('id, symbol, name, market, current_price, price_change_rate')
    .order('volume', { ascending: false })
    .limit(10)
  return (data ?? []) as TickerItem[]
}

export default async function SearchPage() {
  const popular = await getPopularTickers()

  return <SearchScreen popularTickers={popular} />
}
