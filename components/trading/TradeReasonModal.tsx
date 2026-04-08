'use client'

import { useState } from 'react'

interface TradeReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, strategy: 'short' | 'long') => void
  symbol: string
  name: string
}

export default function TradeReasonModal({ isOpen, onClose, onConfirm, symbol, name }: TradeReasonModalProps) {
  const [reason, setReason] = useState('')
  const [strategy, setStrategy] = useState<'short' | 'long'>('long')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-in zoom-in fade-in">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">훈련을 위해 질문할게요</h2>
          <p className="text-xs text-gray-400 font-medium">실패해도 괜찮아요. 기록이 중요합니다.</p>
        </div>

        <div className="flex flex-col gap-6">
          {/* 이유 입력 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-600">이 종목을 선택한 이유는?</label>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="예: 실적이 좋을 것 같아서, 뉴스가 떠서..."
              className="w-full h-24 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm outline-none focus:border-blue-500 transition-colors resize-none"
              required
            />
          </div>

          {/* 단타/장투 선택 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-600">이건 단타인가요, 장투인가요?</label>
            <div className="flex rounded-xl bg-gray-100 p-1">
              <button 
                onClick={() => setStrategy('short')}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  strategy === 'short' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                단기 매매
              </button>
              <button 
                onClick={() => setStrategy('long')}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  strategy === 'long' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                장기 투자
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button 
              onClick={onClose}
              className="flex-1 rounded-2xl bg-gray-100 py-3 text-sm font-bold text-gray-500"
            >
              취소
            </button>
            <button 
              onClick={() => onConfirm(reason, strategy)}
              disabled={!reason.trim()}
              className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              매수하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
