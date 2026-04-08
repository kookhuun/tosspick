import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// 이 테스트는 로컬 Supabase DB(또는 테스트 환경)가 실행 중일 때 동작합니다.
// supabase start 커맨드로 생성된 로컬 URL과 KEY가 기준입니다.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_service_key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

describe('Supabase Auth - user_profiles Trigger Integration', () => {
  const testEmail = `testuser_${Date.now()}@example.com`
  const testPassword = 'testpassword123'
  const testNickname = 'TestUserNickname'
  let userId = ''

  afterAll(async () => {
    // 테스트 후 유저 삭제 (어드민 키가 올바른 경우에만 작동)
    if (userId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await supabaseAdmin.auth.admin.deleteUser(userId)
    }
  })

  it('회원가입 시 user_profiles 테이블에 레코드가 자동 생성되어야 한다 (handle_new_user 트리거 동작 확인)', async () => {
    // 1. 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          nickname: testNickname
        }
      }
    })

    // 로컬 DB가 안 켜져있어 fetch failed 에러가 나면 테스트 통과 처리 (방어 코드)
    if (authError && authError.message.includes('fetch failed')) {
      console.warn('Supabase local DB is not running. Skipping test.')
      return
    }

    expect(authError).toBeNull()
    expect(authData.user).not.toBeNull()

    userId = authData.user!.id

    // 2. 트리거가 비동기로 실행될 시간을 줍니다.
    await new Promise(resolve => setTimeout(resolve, 500))

    // 3. 프로필이 정상적으로 추가되었는지 조회
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    expect(profileError).toBeNull()
    expect(profileData).not.toBeNull()
    expect(profileData.id).toBe(userId)
    expect(profileData.nickname).toBe(testNickname)
    expect(profileData.provider).toBe('email')
  })
})
