import { createClient } from '@/lib/supabase/server'

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: null }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, nickname, avatar_url, provider, created_at')
    .eq('id', user.id)
    .single()

  return { data, error }
}

export async function updateProfile(updates: { nickname?: string; avatar_url?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: '인증이 필요합니다.' } }

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select('id, nickname, avatar_url, provider, created_at')
    .single()

  return { data, error }
}
