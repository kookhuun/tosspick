import Link from 'next/link'

export default function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
      <Link href="/" className="text-lg font-bold text-blue-600">
        투자판
      </Link>
      <Link href="/notifications" aria-label="알림">
        <span className="text-xl">🔔</span>
      </Link>
    </header>
  )
}
