'use client'

import { useState } from 'react'
import { MarketIndex } from '@/lib/data/market'
import { getIndexOneLiner, MARKET_INFO_DATA } from '@/lib/data/market-info'
import MarketInfoModal from './MarketInfoModal'

interface IndexCardProps {
  index: MarketIndex
}

export default function IndexCard({ index }: IndexCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const isPositive = index.change >= 0
  const colorClass = isPositive ? 'text-red-500' : 'text-blue-500'
  const bgColorClass = isPositive ? 'bg-red-50' : 'bg-blue-50'

  // 모달 데이터 매핑 (이름이 다를 수 있어 보정)
  const infoKey = index.name.includes('S&P') ? 'S&P 500' : 
                  index.name.includes('NASDAQ') ? 'IXIC' : index.name
  const info = MARKET_INFO_DATA[infoKey]

  return (
    <>
      <div 
        onClick={() => info && setIsModalOpen(true)}
        className="flex flex-col gap-3 p-5 rounded-[24px] bg-white border border-gray-50 shadow-sm active:scale-95 transition-all cursor-pointer hover:border-blue-100"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-gray-800">{index.name}</h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bgColorClass} ${colorClass}`}>
            {isPositive ? '+' : ''}{index.change_rate.toFixed(2)}%
          </span>
        </div>
        
        <div>
          <p className="text-xl font-black text-gray-900 tracking-tighter">
            {index.current_value.toLocaleString()}
          </p>
          <p className={`text-[11px] font-bold ${colorClass}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(index.change).toLocaleString()}
          </p>
        </div>

        {/* 한 줄 해설 추가 */}
        <div className="mt-1 pt-2 border-t border-gray-50">
          <p className="text-[10px] font-semibold text-gray-500 line-clamp-1">
            {getIndexOneLiner(index.name, index.change_rate)}
          </p>
        </div>
      </div>

      {info && (
        <MarketInfoModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          info={info} 
        />
      )}
    </>
  )
}
