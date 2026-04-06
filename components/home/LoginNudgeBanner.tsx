// @TASK P2-S1-T1
import Link from 'next/link'

export default function LoginNudgeBanner({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) return null

  return (
    <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-center justify-between">
      <p className="text-sm text-blue-800 font-medium">맞춤 뉴스를 받으세요 — 관심 종목을 등록해 보세요</p>
      <Link
        href="/auth"
        className="ml-4 shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        로그인
      </Link>
    </div>
  )
}
