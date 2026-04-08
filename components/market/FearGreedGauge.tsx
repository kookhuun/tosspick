'use client'

import { useState } from 'react'
import { FearGreedData } from '@/lib/data/market'
import { getFearGreedOneLiner, MARKET_INFO_DATA } from '@/lib/data/market-info'
import MarketInfoModal from './MarketInfoModal'

interface FearGreedGaugeProps {
  data: FearGreedData
}

export default function FearGreedGauge({ data }: FearGreedGaugeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const info = MARKET_INFO_DATA['FearGreed']

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:border-orange-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-extrabold text-gray-900">공포와 탐욕 지수</h3>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">심리 지표</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full h-12 bg-gray-100 rounded-2xl overflow-hidden flex items-center p-1">
            {/* 게이지 바 */}
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-xl transition-all duration-1000 shadow-sm"
              style={{ width: `${data.score}%` }}
            />
            {/* 현재 점수 포인터 (글라스모피즘 스타일) */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm border-2 border-white rounded-xl shadow-lg flex items-center justify-center transition-all duration-1000"
              style={{ left: `calc(${data.score}% - 16px)` }}
            >
              <span className="text-[10px] font-black text-gray-900">{data.score}</span>
            </div>
          </div>

          <div className="flex justify-between w-full px-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
            <span>Extreme Fear</span>
            <span>Extreme Greed</span>
          </div>

          {/* 한 줄 해설 추가 */}
          <div className="w-full mt-2 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
            <p className="text-xs font-bold text-orange-600 text-center leading-relaxed">
              "{getFearGreedOneLiner(data.score)}"
            </p>
          </div>
        </div>
      </div>

      <MarketInfoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        info={info} 
      />
    </>
  )
}
