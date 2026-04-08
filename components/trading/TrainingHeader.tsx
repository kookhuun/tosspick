'use client'

import { VirtualBalance } from '@/lib/trading/virtual-balance'

interface TrainingHeaderProps {
  balance: VirtualBalance
}

const MISSIONS = [
  { id: 'm1', title: '3개 종목 분산 투자하기', exp: 100, icon: '📊' },
  { id: 'm2', title: '손절/익절 경험하기', exp: 150, icon: '⚖️' },
  { id: 'm3', title: '뉴스 보고 매수하지 않기', exp: 200, icon: '🚫' },
]

export default function TrainingHeader({ balance }: TrainingHeaderProps) {
  const nextLevelExp = balance.level === '초보' ? 1000 : balance.level === '중수' ? 5000 : 10000
  const progress = (balance.exp / nextLevelExp) * 100

  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* 레벨 & 경험치 섹션 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
              Lv. {balance.level}
            </span>
            <h2 className="text-lg font-bold text-gray-900">투자 훈련 시스템</h2>
          </div>
          <span className="text-xs font-semibold text-gray-400">
            EXP {balance.exp} / {nextLevelExp}
          </span>
        </div>
        
        {/* 경험치 바 */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          다음 레벨인 <span className="text-gray-600 font-bold">고수</span>까지 얼마 남지 않았어요!
        </p>
      </div>

      {/* 오늘의 미션 */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-700 px-1">오늘의 훈련 미션</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MISSIONS.map((mission) => (
            <div 
              key={mission.id}
              className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group"
            >
              <span className="text-2xl">{mission.icon}</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 leading-tight group-hover:text-blue-600">
                  {mission.title}
                </span>
                <span className="text-[10px] text-blue-500 font-semibold mt-0.5">
                  +{mission.exp} EXP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
