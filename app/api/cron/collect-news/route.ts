// GET /api/cron/collect-news
// Vercel Cron 또는 외부 스케줄러가 호출하는 엔드포인트
// 현재: vercel.json cron 주석 처리 → 수동 호출만 가능
// 나중에: vercel.json 주석 해제 시 자동 실행

import { NextResponse } from 'next/server'
import { collectAndSaveNews } from '@/lib/refresh/news'

export async function GET(request: Request) {
  // CRON_SECRET 검증
  const authHeader = request.headers.get('Authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 })
  }

  try {
    const result = await collectAndSaveNews()
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
