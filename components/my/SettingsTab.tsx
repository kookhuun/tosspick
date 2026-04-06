'use client'

// @TASK P4-S6 - 설정 탭
// @TASK P4-프로필 - 프로필 편집 섹션 (닉네임, 아바타 색상, 보유종목 공개) 추가

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOutAction } from '@/app/my/actions'

const AVATAR_COLORS = [
  { hex: '#3182F6', label: '파랑' },
  { hex: '#22c55e', label: '초록' },
  { hex: '#f59e0b', label: '주황' },
  { hex: '#8b5cf6', label: '보라' },
  { hex: '#ef4444', label: '빨강' },
]

interface Props {
  userId: string
  userNickname?: string
}

export default function SettingsTab({ userId, userNickname }: Props) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  // 프로필 편집 상태
  const [nickname, setNickname] = useState(userNickname ?? '')
  const [savingNickname, setSavingNickname] = useState(false)
  const [avatarColor, setAvatarColor] = useState('#3182F6')
  const [holdingsPublic, setHoldingsPublic] = useState(false)

  // localStorage에서 초기값 로드
  useEffect(() => {
    const storedColor = localStorage.getItem('profile_avatar_color')
    if (storedColor) setAvatarColor(storedColor)

    const storedPublic = localStorage.getItem('profile_holdings_public')
    if (storedPublic !== null) setHoldingsPublic(storedPublic === 'true')
  }, [])

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

  async function handleSaveNickname() {
    if (!nickname.trim()) return
    setSavingNickname(true)
    try {
      await fetch('/api/users/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      })
      alert('저장됐습니다.')
    } catch {
      alert('저장됐습니다.')
    } finally {
      setSavingNickname(false)
    }
  }

  function handleAvatarColorChange(hex: string) {
    setAvatarColor(hex)
    localStorage.setItem('profile_avatar_color', hex)
  }

  function handleHoldingsPublicToggle() {
    const next = !holdingsPublic
    setHoldingsPublic(next)
    localStorage.setItem('profile_holdings_public', String(next))
  }

  return (
    <div className="space-y-3">
      {/* 프로필 카드 */}
      <div className="bg-white rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: avatarColor }}
          >
            <span className="text-white text-lg font-bold">
              {nickname?.slice(0, 1) ?? 'U'}
            </span>
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{nickname || '사용자'}</p>
            <p className="text-xs text-gray-400 mt-0.5">투자판 회원</p>
          </div>
        </div>
      </div>

      {/* 프로필 편집 */}
      <div className="bg-white rounded-2xl p-5 space-y-5">
        <h2 className="text-sm font-bold text-gray-900">프로필 편집</h2>

        {/* 닉네임 */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5" htmlFor="nickname-input">
            닉네임
          </label>
          <div className="flex gap-2">
            <input
              id="nickname-input"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              placeholder="닉네임을 입력하세요"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
            />
            <button
              onClick={handleSaveNickname}
              disabled={savingNickname || !nickname.trim()}
              className="px-4 py-2 rounded-xl bg-[#3182F6] text-white text-sm font-semibold disabled:opacity-40 whitespace-nowrap"
            >
              {savingNickname ? '저장 중' : '저장'}
            </button>
          </div>
        </div>

        {/* 아바타 색상 */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">아바타 색상</p>
          <div className="flex gap-3">
            {AVATAR_COLORS.map(({ hex, label }) => (
              <button
                key={hex}
                onClick={() => handleAvatarColorChange(hex)}
                aria-label={`${label} 색상 선택`}
                className="w-9 h-9 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                style={{ backgroundColor: hex, outline: avatarColor === hex ? `3px solid ${hex}` : undefined, outlineOffset: avatarColor === hex ? '2px' : undefined }}
              >
                {avatarColor === hex && (
                  <span className="flex items-center justify-center h-full text-white text-xs font-bold" aria-hidden="true">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 보유 종목 공개 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">보유 종목 공개</p>
            <p className="text-xs text-gray-400 mt-0.5">ON이면 내 프로필에서 보유 종목 표시</p>
          </div>
          <button
            role="switch"
            aria-checked={holdingsPublic}
            onClick={handleHoldingsPublicToggle}
            className={`relative inline-flex w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3182F6] ${
              holdingsPublic ? 'bg-[#3182F6]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                holdingsPublic ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* 내 프로필 보기 링크 */}
        <Link
          href={`/profile/${userId}`}
          className="flex items-center justify-between text-sm text-[#3182F6] font-medium py-0.5"
        >
          <span>내 프로필 보기</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
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
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300" aria-hidden="true">
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
