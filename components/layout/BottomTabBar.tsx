'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { id: 'home', label: '홈', icon: '🏠', path: '/' },
  { id: 'market', label: '시장', icon: '📊', path: '/market' },
  { id: 'search', label: '검색', icon: '🔍', path: '/search' },
  { id: 'trading', label: '훈련', icon: '🎯', path: '/trading' },
  { id: 'my', label: '마이', icon: '👤', path: '/my' },
]

export default function BottomTabBar() {
  const pathname = usePathname()

  // 인증 페이지에서는 탭 바를 숨깁니다.
  if (pathname?.startsWith('/auth')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
        {TABS.map((tab) => {
          const isActive = tab.path === '/' 
            ? pathname === '/' 
            : pathname?.startsWith(tab.path)

          return (
            <Link 
              key={tab.id} 
              href={tab.path}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all ${
                isActive ? 'scale-110' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className={`text-[10px] font-black ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-blue-600 rounded-full absolute bottom-1" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
