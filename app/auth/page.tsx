'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import SocialLoginButtons from '@/components/auth/SocialLoginButtons'

function AuthPageContent() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/')
    })
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">투자판</h1>
          <p className="mt-1 text-sm text-gray-500">초보 투자자를 위한 뉴스 & 시장 분석</p>
        </div>

        {/* 소셜 로그인 */}
        <SocialLoginButtons />

        {/* 구분선 */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400">또는 이메일로</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* 탭 */}
        <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              tab === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* 폼 */}
        {tab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageContent />
    </Suspense>
  )
}
