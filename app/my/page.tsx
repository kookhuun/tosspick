// @TASK P4-S6 - 마이 화면 서버 진입점
// @SPEC docs/planning - 마이페이지

import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import MyPageClient from '@/components/my/MyPageClient'

export default async function MyPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect('/auth?redirect=/my')
  }

  const nickname = (user.user_metadata?.nickname as string | undefined) ?? user.email ?? '사용자'

  return <MyPageClient userId={user.id} userNickname={nickname} />
}
