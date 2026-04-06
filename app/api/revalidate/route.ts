// POST /api/revalidate?tag=news|market|tickers
// 캐시를 즉시 무효화하는 엔드포인트
//
// [지금] 수동으로 호출해서 캐시를 갱신할 수 있음
// [나중에] cron이 데이터 저장 후 자동으로 이 엔드포인트 호출
//
// 인증: Authorization: Bearer REVALIDATE_SECRET
//
// 사용 예:
//   curl -X POST https://your-site.com/api/revalidate?tag=news \
//        -H "Authorization: Bearer your-secret"
//
// 한 번에 여러 태그:
//   curl -X POST https://your-site.com/api/revalidate?tag=news&tag=market \
//        -H "Authorization: Bearer your-secret"

import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

const VALID_TAGS = ['news', 'market', 'tickers'] as const
type ValidTag = typeof VALID_TAGS[number]

export async function POST(request: Request) {
  // 인증
  const secret = process.env.REVALIDATE_SECRET
  if (secret && request.headers.get('Authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tags = searchParams.getAll('tag') as ValidTag[]

  const invalid = tags.filter((t) => !VALID_TAGS.includes(t))
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: `유효하지 않은 태그: ${invalid.join(', ')}. 허용값: ${VALID_TAGS.join(', ')}` },
      { status: 400 }
    )
  }

  const toRevalidate = tags.length > 0 ? tags : [...VALID_TAGS]
  toRevalidate.forEach((tag) => revalidateTag(tag, 'max'))

  return NextResponse.json({
    revalidated: toRevalidate,
    timestamp: new Date().toISOString(),
  })
}
