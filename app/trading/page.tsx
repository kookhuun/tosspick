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
      {/* 페이지 헤더 — 데스크톱 밀도 개선: pt 축소 */}
      <div className="bg-white border-b border-gray-100 px-4 pt-3 pb-0 md:pt-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">투자 훈련 시스템</h1>
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
              <span className="text-[10px] font-bold text-blue-600">보유 자산</span>
              <span className="text-sm font-extrabold text-blue-600">{cashDisplay}</span>
              <span className="text-[10px] font-bold text-emerald-500">오늘 +0.8%</span>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-3.5 text-sm border-b-2 transition-all shrink-0 -mb-px ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 bg-blue-50 rounded-t-md font-extrabold'
                    : 'border-transparent text-gray-500 font-semibold hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-8 md:py-6 md:px-6">
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
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900 mb-3">배지를 모아요</h3>
              <div className="flex flex-wrap gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg grayscale" title="첫 매매">🌱</div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg grayscale" title="분산 투자 전문가">📚</div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg grayscale" title="심리 마스터">🧠</div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg grayscale opacity-30" title="고수">🏅</div>
              </div>
              <p className="mt-2.5 text-xs text-gray-500 font-medium leading-[1.4]">
                다음 획득: <span className="text-gray-700 font-semibold">첫 매매 완료</span> 시 🌱 활성화
              </p>
            </div>

            {/* 최근 훈련 결과 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-gray-900 mb-3">나의 성장 기록</h3>
              {history.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-xs text-gray-500 leading-[1.4] mb-3">아직 훈련 기록이 없어요</p>
                  <button
                    onClick={() => setActiveTab('stocks')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    첫 훈련 시작하기 →
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
