'use client'

import { createClient } from '@/lib/supabase/client'

export default function SocialLoginButtons() {
  const handleKakao = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleKakao}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3 text-sm font-semibold text-gray-900"
      >
        카카오로 계속하기
      </button>
      <button
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700"
      >
        Google로 계속하기
      </button>
    </div>
  )
}
