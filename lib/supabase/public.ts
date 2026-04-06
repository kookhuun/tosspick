// 공개 데이터 전용 Supabase 클라이언트
// cookies() 없이 동작 → unstable_cache 내부에서 안전하게 사용 가능
// 뉴스/주식/시장 등 로그인 불필요한 공개 테이블 조회 전용

import { createClient } from '@supabase/supabase-js'

export function hasSupabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key && key !== 'your-anon-key-here' && url.startsWith('http'))
}

export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
