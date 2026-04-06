'use client'

// @TASK P4-S6 - 마이 페이지 클라이언트 (탭 컨테이너)

import { useState } from 'react'
import WatchlistTab from './WatchlistTab'
import TradeRecordTab from './TradeRecordTab'
import EarningsCalendarTab from './EarningsCalendarTab'
import SettingsTab from './SettingsTab'

type Tab = 'watchlist' | 'trade' | 'earnings' | 'settings'

interface Props {
  userId: string
  userNickname?: string
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'watchlist', label: '관심주' },
  { id: 'trade', label: '매매기록' },
  { id: 'earnings', label: '실적캘린더' },
  { id: 'settings', label: '설정' },
]

export default function MyPageClient({ userId, userNickname }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('watchlist')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="bg-white px-4 pt-6 pb-0">
          <h1 className="text-xl font-bold text-gray-900 mb-4">마이</h1>

          {/* 탭 바 */}
          <div className="flex border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#3182F6]'
                    : 'text-gray-400'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3182F6] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="px-4 py-4">
          {activeTab === 'watchlist' && <WatchlistTab />}
          {activeTab === 'trade' && <TradeRecordTab />}
          {activeTab === 'earnings' && <EarningsCalendarTab />}
          {activeTab === 'settings' && (
            <SettingsTab userId={userId} userNickname={userNickname} />
          )}
        </div>
      </div>
    </div>
  )
}
