/**
 * 인증 관련 API 함수들
 * Supabase Auth를 사용한 사용자 인증 처리
 */

import { supabase } from '@/shared/api/supabase'
import type { User } from '@/shared/types'

/**
 * 회원가입
 * @param email - 사용자 이메일
 * @param password - 비밀번호 (최소 6자)
 * @param name - 사용자 이름
 */
export async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            },
        },
    })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

/**
 * 로그인
 * @param email - 사용자 이메일
 * @param password - 비밀번호
 */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

/**
 * 로그아웃
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * 현재 로그인된 사용자 정보 가져오기
 */
export async function getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    // Supabase user를 우리의 User 타입으로 변환
    return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata.name || '',
        created_at: new Date(user.created_at),
        risk_profile: user.user_metadata.risk_profile,
        investment_goal: user.user_metadata.investment_goal,
        investment_period: user.user_metadata.investment_period,
    }
}

/**
 * 사용자 프로필 업데이트
 * @param updates - 업데이트할 필드들
 */
export async function updateUserProfile(updates: Partial<User>) {
    const { data, error } = await supabase.auth.updateUser({
        data: updates,
    })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

/**
 * 비밀번호 재설정 이메일 전송
 * @param email - 사용자 이메일
 */
export async function sendPasswordResetEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
        throw new Error(error.message)
    }
}

/**
 * 비밀번호 업데이트
 * @param newPassword - 새 비밀번호
 */
export async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) {
        throw new Error(error.message)
    }
}
