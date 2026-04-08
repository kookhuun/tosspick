'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MOCK_BIG_MOVERS } from '@/lib/data/mock'
import { getBalance, saveBalance, recordTrade, Position } from '@/lib/trading/virtual-balance'
import TradeReasonModal from './TradeReasonModal'

interface StockListTabProps {
  onBalanceChange: () => void
}

export default function StockListTab({ onBalanceChange }: StockListTabProps) {
  const searchParams = useSearchParams()
  const initialSymbol = searchParams.get('symbol')

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMarket, setSelectedMarket] = useState<'ALL' | 'KOSPI' | 'KOSDAQ' | 'NASDAQ'>('ALL')
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string; price: number } | null>(null)

  // URL 파라미터로 종목이 넘어오면 바로 모달을 띄워줍니다
  useEffect(() => {
    if (initialSymbol) {
      const stock = MOCK_BIG_MOVERS.find(s => s.symbol === initialSymbol)
      if (stock) {
        setSelectedStock({ symbol: stock.symbol, name: stock.name, price: stock.current_price })
      }
    }
  }, [initialSymbol])

  const filteredTickers = useMemo(() => {
    return MOCK_BIG_MOVERS.filter(t => {
      const matchSearch = t.name.includes(searchTerm) || t.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchMarket = selectedMarket === 'ALL' || t.market === selectedMarket
      return matchSearch && matchMarket
    }).slice(0, 24)
  }, [searchTerm, selectedMarket])

  const handleBuyClick = (ticker: any) => {
    setSelectedStock({ symbol: ticker.symbol, name: ticker.name, price: ticker.current_price })
  }

  const handleConfirmBuy = (reason: string, strategy: 'short' | 'long') => {
    if (!selectedStock) return

    const balance = getBalance()
    const quantity = 10
    const totalCost = selectedStock.price * quantity

    if (balance.cash < totalCost) {
      alert('훈련 자금이 부족합니다!')
      return
    }

    balance.cash -= totalCost
    balance.total_invested += totalCost
    saveBalance(balance)

    recordTrade({
      id: Math.random().toString(36).substr(2, 9),
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      type: 'buy',
      quantity,
      price: selectedStock.price,
      date: new Date().toISOString(),
      reason,
      strategy
    })

    setSelectedStock(null)
    onBalanceChange()
    alert(`${selectedStock.name} 10주를 매수했습니다. 훈련을 시작합니다!`)
  }

  return (
    <div className="flex flex-col gap-6 animate-toss-in">
      {/* 필터 섹션 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="훈련할 종목을 검색하세요 (삼성전자, AAPL...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-blue-500 shadow-sm font-bold"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['ALL', 'KOSPI', 'KOSDAQ', 'NASDAQ'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMarket(m as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                selectedMarket === m 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {m === 'ALL' ? '전체' : m}
            </button>
          ))}
        </div>
      </div>

      {/* 종목 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTickers.map((ticker) => (
          <div 
            key={ticker.symbol}
            className="toss-card toss-pressable p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{ticker.market}</span>
                <span className={`text-[11px] font-black ${ticker.price_change_rate >= 0 ? 'text-[#f04452]' : 'text-[#3182f6]'}`}>
                  {ticker.price_change_rate >= 0 ? '+' : ''}{ticker.price_change_rate}%
                </span>
              </div>
              <h4 className="text-sm font-black text-gray-900 mb-1 truncate">{ticker.name}</h4>
              <p className="text-[11px] font-bold text-gray-400 mb-4 tracking-tight">{ticker.symbol}</p>
            </div>
            
            <div className="flex flex-col gap-2.5">
              <span className="text-sm font-black text-gray-900">
                ₩{ticker.current_price.toLocaleString()}
              </span>
              <button 
                onClick={() => handleBuyClick(ticker)}
                className="w-full py-2.5 bg-[#f2f4f6] text-gray-900 text-[11px] font-black rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                훈련 매수
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 매매 복기 모달 */}
      <TradeReasonModal 
        isOpen={!!selectedStock}
        onClose={() => setSelectedStock(null)}
        onConfirm={handleConfirmBuy}
        symbol={selectedStock?.symbol ?? ''}
        name={selectedStock?.name ?? ''}
      />
    </div>
  )
}
