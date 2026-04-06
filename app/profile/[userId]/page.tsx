// @TASK P4-프로필 - 공개 프로필 서버 진입점

import { notFound } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { MOCK_PROFILES, MOCK_HOLDINGS } from '@/lib/profile/mock-data'
import ProfileClient from '@/components/profile/ProfileClient'

interface Props {
  params: Promise<{ userId: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params

  const profile = MOCK_PROFILES[userId]
  if (!profile) {
    notFound()
  }

  const holdings = MOCK_HOLDINGS[userId] ?? []

  // 현재 로그인 유저 (비로그인이면 undefined)
  const authUser = await getAuthUser()
  const currentUserId = authUser?.id

  return (
    <ProfileClient
      profile={profile}
      holdings={holdings}
      currentUserId={currentUserId}
    />
  )
}
