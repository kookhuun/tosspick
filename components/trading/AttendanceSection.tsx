'use client'

// @TASK T-TRADING - 출석 체크 섹션

import { useState, useEffect } from 'react'
import { checkAndClaimAttendance, getBalance } from '@/lib/trading/virtual-balance'

interface AttendanceSectionProps {
  onClaimed?: () => void
}

export default function AttendanceSection({ onClaimed }: AttendanceSectionProps) {
  const [claimed, setClaimed] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // 오늘 이미 출석했는지 확인
    const balance = getBalance()
    const today = new Date().toISOString().slice(0, 10)
    setClaimed(balance.last_attendance === today)

    // 연속 출석일 계산 (간단하게 1-7 랜덤 — 실제 구현은 별도 스토리지 필요)
    const storedStreak = parseInt(localStorage.getItem('vb_streak') || '0', 10)
    setStreak(storedStreak)
  }, [])

  function handleAttendance() {
    if (claimed) return
    const result = checkAndClaimAttendance()
    if (result.claimed) {
      const newStreak = streak + 1
      localStorage.setItem('vb_streak', String(newStreak))
      setStreak(newStreak)
      setClaimed(true)
      setShowSuccess(true)
      onClaimed?.()
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base" aria-hidden="true">
          &#128197;
        </span>
        <p className="text-sm font-bold text-gray-900">오늘의 출석</p>
      </div>

      <p className="text-xs text-gray-500 mb-3">출석 시 ₩300,000 지급</p>

      {showSuccess && (
        <div className="mb-3 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
          출석 완료! ₩300,000 지급되었습니다.
        </div>
      )}

      <button
        onClick={handleAttendance}
        disabled={claimed}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          claimed
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        aria-label={claimed ? '출석 완료' : '출석 체크하기'}
      >
        {claimed ? '출석 완료 ✓' : '출석 체크하기'}
      </button>

      {streak > 0 && (
        <p className="mt-2.5 text-center text-xs text-gray-500">
          연속 출석: <span className="font-semibold text-blue-600">{streak}일째</span>
        </p>
      )}
    </div>
  )
}
