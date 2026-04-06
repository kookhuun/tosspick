'use client'

// @TASK T-TRADING - 포트폴리오 탭

import { useMemo } from 'react'
import { type VirtualBalance, type Position, type TradeHistory } from '@/lib/trading/virtual-balance'

interface PortfolioTabProps {
  balance: VirtualBalance
  positions: Position[]
  history: TradeHistory[]
}

function formatKRW(amount: number): string {
  return `₩${Math.round(amount).toLocaleString('ko-KR')}`
}

function formatRate(rate: number): string {
  return `${rate >= 0 ? '+' : ''}${rate.toFixed(2)}%`
}

export default function PortfolioTab({ balance, positions, history }: PortfolioTabProps) {
  const stats = useMemo(() => {
    const totalPositionValue = positions.reduce(
      (sum, p) => sum + p.current_price * p.quantity,
      0
    )
    const totalAsset = balance.cash + totalPositionValue
    const totalPnl = totalPositionValue - balance.total_invested
    const pnlRate = balance.total_invested > 0 ? (totalPnl / balance.total_invested) * 100 : 0

    return { totalAsset, totalPositionValue, totalPnl, pnlRate }
  }, [balance, positions])

  return (
    <div className="flex flex-col gap-5">
      {/* 자산 요약 */}
      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
        <p className="text-xs font-medium text-gray-400 mb-1">총 자산</p>
        <p className="text-2xl font-bold text-gray-900 mb-3">{formatKRW(stats.totalAsset)}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500 mb-0.5">보유 현금</p>
            <p className="text-sm font-semibold text-gray-800">{formatKRW(balance.cash)}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500 mb-0.5">투자 금액</p>
            <p className="text-sm font-semibold text-gray-800">{formatKRW(balance.total_invested)}</p>
          </div>
          <div
            className={`rounded-xl p-3 col-span-2 ${
              stats.totalPnl >= 0 ? 'bg-red-50' : 'bg-blue-50'
            }`}
          >
            <p className="text-xs text-gray-500 mb-0.5">총 평가손익</p>
            <p
              className={`text-sm font-bold ${
                stats.totalPnl >= 0 ? 'text-red-600' : 'text-blue-600'
              }`}
            >
              {stats.totalPnl >= 0 ? '+' : ''}
              {formatKRW(stats.totalPnl)}{' '}
              <span className="text-xs font-medium">({formatRate(stats.pnlRate)})</span>
            </p>
          </div>
        </div>
      </div>

      {/* 보유 종목 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">보유 종목</h3>
        {positions.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-100 py-6 text-center text-sm text-gray-400">
            보유 중인 종목이 없습니다.
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-gray-100">
            {positions.map((pos, i) => {
              const value = pos.current_price * pos.quantity
              const cost = pos.avg_price * pos.quantity
              const pnl = value - cost
              const pnlRate = cost > 0 ? (pnl / cost) * 100 : 0
              const isPos = pnl >= 0

              return (
                <div
                  key={pos.symbol}
                  className={`flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 ${
                    i !== 0 ? 'border-t border-gray-50' : ''
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{pos.name}</p>
                    <p className="text-xs text-gray-400">
                      {pos.quantity.toLocaleString()}주 · 평단{' '}
                      {formatKRW(pos.avg_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatKRW(value)}</p>
                    <p className={`text-xs font-medium ${isPos ? 'text-red-500' : 'text-blue-500'}`}>
                      {isPos ? '+' : ''}
                      {formatKRW(pnl)} ({formatRate(pnlRate)})
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 거래 내역 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-2">거래 내역 (최근 10건)</h3>
        {history.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-100 py-6 text-center text-sm text-gray-400">
            거래 내역이 없습니다.
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-gray-100">
            {history.slice(0, 10).map((h, i) => {
              const isBuy = h.type === 'buy'
              const date = new Date(h.timestamp)
              const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

              return (
                <div
                  key={h.id}
                  className={`flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 ${
                    i !== 0 ? 'border-t border-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isBuy ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {isBuy ? '매수' : '매도'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{h.name}</p>
                      <p className="text-xs text-gray-400">
                        {h.quantity}주 @ {formatKRW(h.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${isBuy ? 'text-red-600' : 'text-blue-600'}`}>
                      {isBuy ? '-' : '+'}{formatKRW(h.total)}
                    </p>
                    <p className="text-xs text-gray-400">{dateStr}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
