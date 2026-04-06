'use server'

// @TASK P4-S6 - 마이 페이지 서버 액션

import { signOut } from '@/lib/auth'

export async function signOutAction() {
  await signOut()
}
