'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: '홈', route: '/' },
  { label: '시장', route: '/market' },
  { label: '검색', route: '/search' },
  { label: '모의투자', route: '/trading' },
  { label: '커뮤니티', route: '/community' },
  { label: '학습', route: '/learn' },
  { label: '글로벌', route: '/global' },
  { label: '마이', route: '/my' },
]

export default function TopNavbar() {
  const pathname = usePathname()

  return (
    <header className="hidden md:flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold text-blue-600">
          투자판
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.route}
              href={item.route}
              className={`text-sm font-medium transition-colors ${
                pathname === item.route
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <span className="text-sm font-medium text-gray-400 cursor-default">안국현바보</span>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/notifications" aria-label="알림">
          🔔
        </Link>
        <Link
          href="/auth"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          로그인
        </Link>
      </div>
    </header>
  )
}
