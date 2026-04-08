'use client'

import { useState, useEffect, useCallback } from 'react'
import RandomChartTab from '@/components/trading/RandomChartTab'
import StockListTab from '@/components/trading/StockListTab'
import PortfolioTab from '@/components/trading/PortfolioTab'
import TrainingHeader from '@/components/trading/TrainingHeader'
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
  { id: 'stocks', label: '실제 종목 훈련' },
  { id: 'random', label: '랜덤 차트 훈련' },
  { id: 'portfolio', label: '나의 훈련 기록' },
]

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stocks')
  const [balance, setBalance] = useState<VirtualBalance | null>(null)
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

  if (!balance) return null

  const cashDisplay = `₩${Math.round(balance.cash).toLocaleString('ko-KR')}`

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-gray-100 px-4 pt-6 pb-0 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">투자 훈련 시스템</h1>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5">
              <span className="text-[10px] font-bold text-blue-400">보유 자산</span>
              <span className="text-sm font-extrabold text-blue-600">{cashDisplay}</span>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-3.5 text-sm font-bold border-b-2 transition-all shrink-0 -mb-px ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-6">
        {/* 상단 훈련 정보 및 미션 (Step 2에서 만든 컴포넌트) */}
        <TrainingHeader balance={balance} />

        <div className="flex flex-col md:flex-row gap-8">
          {/* 왼쪽: 메인 탭 내용 */}
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
          </div>

          {/* 오른쪽: 요약 정보 (경험치 기반 배지 등) */}
          <aside className="w-full md:w-80 shrink-0 flex flex-col gap-4">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900 mb-4">획득한 훈련 배지</h3>
              <div className="flex flex-wrap gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-xl grayscale" title="첫 매매">🌱</div>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-xl grayscale" title="분산 투자 전문가">📚</div>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-xl grayscale" title="심리 마스터">🧠</div>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-xl grayscale opacity-30" title="고수">🏅</div>
              </div>
              <p className="mt-4 text-[10px] text-gray-400 leading-normal">
                미션을 완료하고 배지를 활성화하세요. 배지는 실전 투자 자신감의 척도가 됩니다.
              </p>
            </div>
            
            {/* 최근 훈련 결과 */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900 mb-4">나의 성장 기록</h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">총 훈련 횟수</span>
                  <span className="text-sm font-bold text-gray-900">{history.length}회</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">기록된 이유</span>
                  <span className="text-sm font-bold text-gray-900">
                    {history.filter(h => !!h.reason).length}개
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
