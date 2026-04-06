// @TASK P4-회사분석 - 탭 전환 Client Component
'use client'

import { useState } from 'react'
import KeyIndicators from '@/components/stock/KeyIndicators'
import RelatedNews from '@/components/stock/RelatedNews'
import CompanyOverview from '@/components/stock/analysis/CompanyOverview'
import FinancialAnalysis from '@/components/stock/analysis/FinancialAnalysis'
import EventImpactAnalysis from '@/components/stock/analysis/EventImpactAnalysis'
import type { TickerDetailData } from '@/components/stock/KeyIndicators'
import type { NewsItem } from '@/components/stock/RelatedNews'
import type { TickerData } from '@/components/stock/StockHeader'

interface StockTabsProps {
  ticker: TickerData
  detail: TickerDetailData & { per?: number | null; pbr?: number | null; eps?: number | null }
  news: NewsItem[]
  symbol: string
}

type TabId = 'info' | 'news' | 'analysis'

const TABS: { id: TabId; label: string }[] = [
  { id: 'info', label: '기업정보' },
  { id: 'news', label: '뉴스' },
  { id: 'analysis', label: '회사 분석' },
]

export default function StockTabs({ ticker, detail, news, symbol }: StockTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('info')

  return (
    <div>
      {/* 탭 헤더 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-3">
        <div className="flex" role="tablist" aria-label="종목 정보 탭">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex-1 py-3 text-sm font-medium transition-colors
                  ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 탭 패널 */}
      <div className="px-3 pt-3 flex flex-col gap-3">
        {/* 기업정보 탭 */}
        <div
          role="tabpanel"
          id="tabpanel-info"
          aria-labelledby="tab-info"
          hidden={activeTab !== 'info'}
        >
          {activeTab === 'info' && (
            <KeyIndicators detail={detail} />
          )}
        </div>

        {/* 뉴스 탭 */}
        <div
          role="tabpanel"
          id="tabpanel-news"
          aria-labelledby="tab-news"
          hidden={activeTab !== 'news'}
        >
          {activeTab === 'news' && (
            <RelatedNews news={news} />
          )}
        </div>

        {/* 회사 분석 탭 */}
        <div
          role="tabpanel"
          id="tabpanel-analysis"
          aria-labelledby="tab-analysis"
          hidden={activeTab !== 'analysis'}
        >
          {activeTab === 'analysis' && (
            <>
              <CompanyOverview
                symbol={symbol}
                marketCap={ticker.market_cap}
                volume={ticker.volume}
              />
              <div className="mt-3">
                <FinancialAnalysis
                  symbol={symbol}
                  per={detail.per}
                  pbr={detail.pbr}
                  eps={detail.eps}
                />
              </div>
              <div className="mt-3">
                <EventImpactAnalysis symbol={symbol} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
