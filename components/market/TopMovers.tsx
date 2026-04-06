'use client'
// @TASK P2-S2-T1
import { useState } from 'react'
import Link from 'next/link'

export interface Mover {
  id: string | number
  symbol: string
  name: string
  price_change_rate: number
}

interface TopMoversProps {
  gainers: Mover[]
  losers: Mover[]
}

export default function TopMovers({ gainers, losers }: TopMoversProps) {
  const [tab, setTab] = useState<'gainers' | 'losers'>('gainers')
  const items = tab === 'gainers' ? gainers : losers

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setTab('gainers')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            tab === 'gainers' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          상승
        </button>
        <button
          onClick={() => setTab('losers')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            tab === 'losers' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          하락
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => {
          const isUp = item.price_change_rate >= 0
          return (
            <li key={item.id}>
              <Link
                href={`/stock/${item.symbol}`}
                className="flex items-center justify-between hover:bg-gray-50 rounded-lg px-1 py-1 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900">{item.name}</span>
                <span className={`text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                  {isUp ? '+' : ''}{item.price_change_rate.toFixed(2)}%
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
