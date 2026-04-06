'use client'

// @TASK T-TRADING - 광고 배너 (광고 시청 후 현금 지급)

import { useState, useEffect, useRef } from 'react'
import { claimAdReward, getAdCooldown } from '@/lib/trading/virtual-balance'

interface AdBannerProps {
  onRewardClaimed?: () => void
}

export default function AdBanner({ onRewardClaimed }: AdBannerProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'watching' | 'done' | 'cooldown'>('idle')
  const [cooldownMs, setCooldownMs] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const remaining = getAdCooldown()
    if (remaining > 0) {
      setStatus('cooldown')
      setCooldownMs(remaining)
    }
  }, [])

  // 쿨다운 카운트다운
  useEffect(() => {
    if (status !== 'cooldown') return
    const id = setInterval(() => {
      setCooldownMs((prev) => {
        if (prev <= 1000) {
          clearInterval(id)
          setStatus('idle')
          return 0
        }
        return prev - 1000
      })
    }, 1000)
    return () => clearInterval(id)
  }, [status])

  function handleWatch() {
    if (status !== 'idle') return
    setStatus('watching')
    setCountdown(5)

    let count = 5
    timerRef.current = setInterval(() => {
      count -= 1
      setCountdown(count)
      if (count <= 0) {
        clearInterval(timerRef.current!)
        const ok = claimAdReward()
        if (ok) {
          setStatus('done')
          onRewardClaimed?.()
          setTimeout(() => {
            setStatus('cooldown')
            setCooldownMs(60 * 60 * 1000)
          }, 2000)
        } else {
          setStatus('cooldown')
        }
      }
    }, 1000)
  }

  function formatCooldown(ms: number): string {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m}:${String(s).padStart(2, '0')} 후 가능`
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      {/* 광고 이미지 플레이스홀더 */}
      <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs font-medium text-gray-400">광고 영역</p>
          <p className="text-xs text-gray-300 mt-0.5">300 × 96</p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1 font-medium">광고</p>
        <p className="text-sm font-bold text-gray-900 mb-3">
          광고를 시청하고 현금을 받아보세요!
        </p>

        {status === 'idle' && (
          <button
            onClick={handleWatch}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            광고 시청하기 +₩100,000
          </button>
        )}

        {status === 'watching' && (
          <div className="w-full py-2.5 rounded-xl bg-gray-100 text-center">
            <p className="text-sm font-semibold text-gray-700">
              시청 중... {countdown}
            </p>
            <div className="mt-1.5 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - (countdown ?? 0)) / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="w-full py-2.5 rounded-xl bg-green-50 text-center">
            <p className="text-sm font-semibold text-green-700">
              ₩100,000 지급 완료!
            </p>
          </div>
        )}

        {status === 'cooldown' && (
          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
          >
            {formatCooldown(cooldownMs)}
          </button>
        )}
      </div>
    </div>
  )
}
