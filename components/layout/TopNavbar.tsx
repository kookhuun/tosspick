'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function TopNavbar() {
  const pathname = usePathname()
  const router = useRouter()

  // 메인 페이지가 아닐 때만 '뒤로가기' 표시
  const isHome = pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {!isHome ? (
          <button 
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-50 rounded-full transition-colors"
          >
            ←
          </button>
        ) : (
          <Link href="/" className="text-lg font-black text-blue-600 tracking-tighter">
            TOSSPICK
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Link 
          href="/market" 
          className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
            pathname === '/market' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          시장
        </Link>
        <Link 
          href="/trading" 
          className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
            pathname === '/trading' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          훈련
        </Link>
        <Link 
          href="/search" 
          className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50 rounded-full transition-all"
        >
          🔍
        </Link>
        <Link 
          href="/my" 
          className="w-10 h-10 flex items-center justify-center text-lg hover:bg-gray-50 rounded-full transition-all"
        >
          👤
        </Link>
      </div>
    </nav>
  )
}
