'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { id: 'home', label: '홈', route: '/' },
  { id: 'market', label: '시장', route: '/market' },
  { id: 'search', label: '검색', route: '/search' },
  { id: 'trading', label: '모의투자', route: '/trading' },
  { id: 'learn', label: '학습', route: '/learn' },
  { id: 'my', label: '마이', route: '/my' },
]

export default function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-white md:hidden">
      {TABS.map((tab) => {
        const isActive = pathname === tab.route
        return (
          <Link
            key={tab.id}
            href={tab.route}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
