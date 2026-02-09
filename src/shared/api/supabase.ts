/**
 * Supabase 클라이언트 설정
 * 
 * 이 파일은 Supabase 클라이언트를 초기화하고 내보냅니다.
 * 환경 변수에서 URL과 anon key를 가져옵니다.
 */

import { createClient } from '@supabase/supabase-js'

// 환경 변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.\n' +
        'NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY가 필요합니다.'
    )
}

/**
 * Supabase 클라이언트 인스턴스
 * 
 * @example
 * import { supabase } from '@/shared/api/supabase'
 * 
 * const { data, error } = await supabase
 *   .from('users')
 *   .select('*')
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
})
