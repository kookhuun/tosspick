'use client'

// @TASK T-TRADING - 모의투자 메인 페이지

import { useState, useEffect, useCallback } from 'react'
import RandomChartTab from '@/components/trading/RandomChartTab'
import StockListTab from '@/components/trading/StockListTab'
import PortfolioTab from '@/components/trading/PortfolioTab'
import AdBanner from '@/components/trading/AdBanner'
import AttendanceSection from '@/components/trading/AttendanceSection'
import {
  getBalance,
  getPositions,
  getHistory,
  type VirtualBalance,
  type Position,
  type TradeHistory,
} from '@/lib/trading/virtual-balance'

type ActiveTab = 'stocks' | 'random' | 'portfolio'

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'stocks', label: '실제 종목' },
  { id: 'random', label: '랜덤 차트' },
  { id: 'portfolio', label: '포트폴리오' },
]

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stocks')
  const [balance, setBalance] = useState<VirtualBalance>({ cash: 1_000_000, total_invested: 0, last_attendance: null })
  const [positions, setPositions] = useState<Position[]>([])
  const [history, setHistory] = useState<TradeHistory[]>([])

  const refreshData = useCallback(() => {
    setBalance(getBalance())
    setPositions(getPositions())
    setHistory(getHistory())
  }, [])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const cashDisplay = `₩${Math.round(balance.cash).toLocaleString('ko-KR')}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 pt-4 pb-0 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-gray-900">모의투자</h1>
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
              <span className="text-xs text-gray-500">현금</span>
              <span className="text-sm font-bold text-blue-600">{cashDisplay}</span>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-0 border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl mx-auto px-4 py-5 md:px-6">
        <div className="flex gap-6 items-start">
          {/* 왼쪽: 탭 내용 */}
          <div className="flex-1 min-w-0">
            {activeTab === 'stocks' && (
              <StockListTab onBalanceChange={refreshData} />
            )}
            {activeTab === 'random' && (
              <RandomChartTab onBalanceChange={refreshData} />
            )}
            {activeTab === 'portfolio' && (
              <PortfolioTab balance={balance} positions={positions} history={history} />
            )}

            {/* 모바일: 탭 하단에 광고/출석 표시 */}
            <div className="md:hidden flex flex-col gap-4 mt-6">
              <AdBanner onRewardClaimed={refreshData} />
              <AttendanceSection onClaimed={refreshData} />
            </div>
          </div>

          {/* 오른쪽 사이드바: 데스크톱에서만 표시 */}
          <aside className="hidden md:flex flex-col gap-4 w-64 shrink-0">
            <AdBanner onRewardClaimed={refreshData} />
            <AttendanceSection onClaimed={refreshData} />

            {/* 빠른 잔고 요약 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 mb-3">잔고 현황</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">보유 현금</span>
                  <span className="font-semibold text-gray-800">{cashDisplay}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">투자 중</span>
                  <span className="font-semibold text-gray-800">
                    ₩{Math.round(balance.total_invested).toLocaleString('ko-KR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-50 pt-2">
                  <span className="text-gray-500">보유 종목</span>
                  <span className="font-semibold text-blue-600">{positions.length}개</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
