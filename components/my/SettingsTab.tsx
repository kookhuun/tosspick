'use client'

// @TASK P4-S6 - 설정 탭

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOutAction } from '@/app/my/actions'

interface Props {
  userId: string
  userNickname?: string
}

export default function SettingsTab({ userNickname }: Props) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOutAction()
      router.push('/')
      router.refresh()
    } catch {
      alert('로그아웃에 실패했습니다.')
      setSigningOut(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* 프로필 카드 */}
      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#3182F6] flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {userNickname?.slice(0, 1) ?? 'U'}
            </span>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{userNickname ?? '사용자'}</p>
            <p className="text-xs text-gray-400 mt-0.5">투자판 회원</p>
          </div>
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center justify-between px-5 py-4 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <span>{signingOut ? '로그아웃 중...' : '로그아웃'}</span>
          {!signingOut && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* 계정 탈퇴 (placeholder) */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <button
          disabled
          className="w-full flex items-center justify-between px-5 py-4 text-sm text-red-400 opacity-40 cursor-not-allowed"
        >
          <span>계정 탈퇴</span>
          <span className="text-xs text-gray-300">준비 중</span>
        </button>
      </div>

      <p className="text-center text-xs text-gray-300 pt-2">투자판 v0.1</p>
    </div>
  )
}
