// @TASK P2-R1-T2 - 뉴스 수집 Cron Job
// @SPEC docs/planning/02-trd.md#뉴스-수집-Cron

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { collectNews } from '@/lib/services/news-collector'
import { summarizeNews } from '@/lib/services/news-summarizer'

export async function GET(request: Request) {
  // CRON_SECRET 검증
  const authHeader = request.headers.get('Authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 })
  }

  try {
    const articles = await collectNews(10)
    const supabase = await createClient()

    let collected = 0
    let skipped = 0

    for (const article of articles) {
      try {
        const summary = await summarizeNews(article.title, article.description)

        const { error } = await supabase
          .from('news_items')
          .upsert(
            {
              title: article.title,
              summary_one_line: summary.summary_one_line,
              impact_direction: summary.impact_direction,
              related_tickers: summary.related_tickers,
              source_url: article.url,
              published_at: article.publishedAt,
              collected_at: new Date().toISOString(),
            },
            { onConflict: 'source_url', ignoreDuplicates: true }
          )

        if (error) {
          skipped++
        } else {
          collected++
        }
      } catch {
        skipped++
      }
    }

    return NextResponse.json({ collected, skipped })
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
