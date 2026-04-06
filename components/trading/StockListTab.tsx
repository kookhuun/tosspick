'use client'

// @TASK T-TRADING - 실제 종목 목록 탭 (국내/해외, 검색, 섹터 필터)

import { useState } from 'react'
import {
  DOMESTIC_STOCKS,
  OVERSEAS_STOCKS,
  getDomesticSectors,
  getOverseasSectors,
  type StockItem,
} from '@/lib/trading/stocks-data'
import { buyStock, getBalance } from '@/lib/trading/virtual-balance'

interface BuyModalState {
  stock: StockItem | null
  quantity: string
}

export default function StockListTab({ onBalanceChange }: { onBalanceChange?: () => void }) {
  const [tab, setTab] = useState<'domestic' | 'overseas'>('domestic')
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState<string | null>(null)
  const [modal, setModal] = useState<BuyModalState>({ stock: null, quantity: '1' })
  const [message, setMessage] = useState<string | null>(null)

  const stocks = tab === 'domestic' ? DOMESTIC_STOCKS : OVERSEAS_STOCKS
  const sectors = tab === 'domestic' ? getDomesticSectors() : getOverseasSectors()

  const filtered = stocks.filter((s) => {
    const matchSearch =
      search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.symbol.toLowerCase().includes(search.toLowerCase())
    const matchSector = sector === null || s.sector === sector
    return matchSearch && matchSector
  })

  function showMessage(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(null), 2500)
  }

  function handleBuyConfirm() {
    if (!modal.stock) return
    const qty = parseInt(modal.quantity, 10)
    if (!qty || qty <= 0) return showMessage('수량을 입력해주세요.')
    const ok = buyStock(modal.stock.symbol, modal.stock.name, modal.stock.price, qty)
    if (ok) {
      showMessage(`매수 완료: ${modal.stock.name} ${qty}주`)
      onBalanceChange?.()
      setModal({ stock: null, quantity: '1' })
    } else {
      const balance = getBalance()
      showMessage(`잔고 부족 (보유 현금: ₩${balance.cash.toLocaleString('ko-KR')})`)
    }
  }

  const priceFormat = (stock: StockItem) => {
    if (stock.market === 'domestic') {
      return `₩${stock.price.toLocaleString('ko-KR')}`
    }
    return `$${stock.price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 국내/해외 탭 */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {(['domestic', 'overseas'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSector(null) }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'domestic' ? '국내' : '해외'}
          </button>
        ))}
      </div>

      {/* 검색 */}
      <div className="relative">
        <input
          type="search"
          placeholder="종목명 또는 코드 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          aria-label="종목 검색"
        />
      </div>

      {/* 섹터 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setSector(null)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            sector === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        {sectors.map((s) => (
          <button
            key={s}
            onClick={() => setSector(sector === s ? null : s)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              sector === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 종목 목록 */}
      <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-gray-100">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">검색 결과가 없습니다.</div>
        ) : (
          filtered.map((stock, i) => {
            const isPos = stock.change_rate >= 0
            return (
              <div
                key={stock.symbol}
                className={`flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors ${
                  i !== 0 ? 'border-t border-gray-50' : ''
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate">{stock.name}</span>
                  <span className="text-xs text-gray-400">{stock.symbol} · {stock.sector}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900">{priceFormat(stock)}</span>
                    <span className={`text-xs font-medium ${isPos ? 'text-red-500' : 'text-blue-500'}`}>
                      {isPos ? '+' : ''}{stock.change_rate.toFixed(2)}%
                    </span>
                  </div>
                  <button
                    onClick={() => setModal({ stock, quantity: '1' })}
                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors min-w-[44px] min-h-[36px]"
                    aria-label={`${stock.name} 매수`}
                  >
                    매수
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 토스트 메시지 */}
      {message && (
        <div className="rounded-lg bg-gray-800 text-white text-sm px-4 py-2.5 font-medium">
          {message}
        </div>
      )}

      {/* 매수 모달 */}
      {modal.stock && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="buy-modal-title"
          onClick={(e) => e.target === e.currentTarget && setModal({ stock: null, quantity: '1' })}
        >
          <div className="w-full max-w-md bg-white rounded-t-2xl md:rounded-2xl p-6 shadow-xl">
            <h2 id="buy-modal-title" className="text-base font-bold text-gray-900 mb-1">
              {modal.stock.name} 매수
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              현재가: {priceFormat(modal.stock)}
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="modal-qty" className="text-sm font-medium text-gray-700">
                수량
              </label>
              <input
                id="modal-qty"
                type="number"
                min="1"
                value={modal.quantity}
                onChange={(e) => setModal((m) => ({ ...m, quantity: e.target.value }))}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {modal.quantity && parseInt(modal.quantity, 10) > 0 && (
                <p className="text-xs text-gray-400">
                  총 {priceFormat({ ...modal.stock, price: modal.stock.price * parseInt(modal.quantity || '1', 10) })}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setModal({ stock: null, quantity: '1' })}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleBuyConfirm}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-colors"
              >
                매수 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
