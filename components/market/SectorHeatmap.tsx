'use client'

import { Sector } from '@/lib/data/market'

interface SectorHeatmapProps {
  sectors: Sector[]
}

export default function SectorHeatmap({ sectors }: SectorHeatmapProps) {
  // 당일 가장 강한 섹터 찾기
  const topSector = [...sectors].sort((a, b) => b.change_rate - a.change_rate)[0]

  return (
    <div className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-extrabold text-gray-900">섹터별 흐름</h3>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">실시간 테마</span>
      </div>

      {/* 섹터 요약 추가 */}
      {topSector && (
        <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
          <p className="text-xs font-bold text-blue-600 leading-relaxed">
            "{topSector.name} 섹터가 {topSector.change_rate}% 오르며 시장을 주도하고 있어요!"
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {sectors.map((sector) => (
          <div 
            key={sector.id}
            className="flex flex-col gap-1 p-4 rounded-[20px] bg-gray-50 transition-transform active:scale-95"
          >
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{sector.name}</span>
            <span className={`text-sm font-black ${sector.change_rate >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
              {sector.change_rate >= 0 ? '+' : ''}{sector.change_rate.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
