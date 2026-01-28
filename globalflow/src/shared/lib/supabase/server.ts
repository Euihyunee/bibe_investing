/**
 * Supabase 서버 클라이언트 (Server Actions용)
 * 
 * Next.js App Router의 Server Components/Actions에서 사용
 */

import { createClient as createSupabase } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * 서버용 Supabase 클라이언트 생성
 * 쿠키에서 세션 정보를 가져와 인증된 요청을 수행
 */
export async function createClient() {
    const cookieStore = await cookies()

    return createSupabase(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
        global: {
            headers: {
                // 쿠키에서 인증 토큰 가져오기
                Authorization: cookieStore.get('sb-access-token')?.value
                    ? `Bearer ${cookieStore.get('sb-access-token')?.value}`
                    : '',
            },
        },
    })
}
