'use client'

import { MarketIndicatorInfo } from '@/lib/data/market-info'

interface MarketInfoModalProps {
  isOpen: boolean
  onClose: () => void
  info: MarketIndicatorInfo
}

export default function MarketInfoModal({ isOpen, onClose, info }: MarketInfoModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm transition-all">
      <div 
        className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{info.title}</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <section>
              <h3 className="text-[10px] font-bold text-blue-500 mb-1 uppercase tracking-wider">이게 뭐예요?</h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {info.definition}
              </p>
            </section>

            <section>
              <h3 className="text-[10px] font-bold text-green-500 mb-1 uppercase tracking-wider">어떻게 봐요?</h3>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {info.how_to_read}
              </p>
            </section>

            <section className="bg-orange-50 p-4 rounded-2xl">
              <h3 className="text-[10px] font-bold text-orange-600 mb-1 uppercase tracking-wider">주의하세요!</h3>
              <p className="text-xs text-orange-700 leading-relaxed font-semibold">
                {info.caution}
              </p>
            </section>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            알겠어요!
          </button>
        </div>
      </div>
    </div>
  )
}
