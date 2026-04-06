'use client'
// 국내 / 해외 탭 전환 wrapper

import { useState } from 'react'

interface MarketTabsProps {
  domestic: React.ReactNode
  overseas: React.ReactNode
}

export default function MarketTabs({ domestic, overseas }: MarketTabsProps) {
  const [tab, setTab] = useState<'domestic' | 'overseas'>('domestic')

  return (
    <div className="flex flex-col gap-4">
      {/* 탭 헤더 */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setTab('domestic')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'domestic'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          국내주식
        </button>
        <button
          onClick={() => setTab('overseas')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === 'overseas'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          해외주식
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div>{tab === 'domestic' ? domestic : overseas}</div>
    </div>
  )
}
