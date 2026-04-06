'use server'

import { query } from '@/shared/api/db'
import { hashPassword, comparePassword, generateToken, verifyToken } from '@/shared/lib/auth'
import type { User } from '@/shared/types'

/**
 * 회원가입
 * @param email - 사용자 이메일
 * @param password - 비밀번호 (최소 6자)
 * @param name - 사용자 이름
 */
export async function signUp(email: string, password: string, name: string) {
    const hashed = await hashPassword(password)
    
    try {
        const result = await query(
            'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, name, hashed]
        )
        
        return { user: result.rows[0] }
    } catch (error: any) {
        if (error.code === '23505') { // Unique violation
            throw new Error('이미 존재하는 이메일입니다.')
        }
        throw new Error(error.message)
    }
}

import { cookies } from 'next/headers'

/**
 * 로그인
 * @param email - 사용자 이메일
 * @param password - 비밀번호
 */
export async function signIn(email: string, password: string) {
    const result = await query(
        'SELECT id, email, name, password_hash, created_at, risk_profile, investment_goal, investment_period FROM users WHERE email = $1',
        [email]
    )

    const user = result.rows[0]
    if (!user) {
        throw new Error('사용자를 찾을 수 없습니다.')
    }

    const isMatch = await comparePassword(password, user.password_hash)
    if (!isMatch) {
        throw new Error('비밀번호가 일치하지 않습니다.')
    }

    const token = generateToken({ id: user.id, email: user.email })
    
    // JWT 토큰을 httpOnly 쿠키에 저장
    const cookieStore = await cookies()
    cookieStore.set('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7일
    })
    
    return { 
        session: { access_token: token }, 
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.created_at,
            risk_profile: user.risk_profile,
            investment_goal: user.investment_goal,
            investment_period: user.investment_period
        } 
    }
}

/**
 * 로그아웃 - 쿠키에서 JWT 토큰을 제거합니다.
 */
export async function signOut() {
    const cookieStore = await cookies()
    cookieStore.delete('access_token')
}

/**
 * 현재 로그인된 사용자 정보 가져오기 (JWT 검증 기반)
 * @param token - (선택 사항) 클라이언트로부터 전달받은 JWT 토큰. 없으면 쿠키에서 확인.
 */
export async function getCurrentUser(token?: string): Promise<User | null> {
    let jwtToken = token

    if (!jwtToken) {
        const cookieStore = await cookies()
        jwtToken = cookieStore.get('access_token')?.value
    }

    if (!jwtToken) return null

    const decoded = verifyToken(jwtToken)
    if (!decoded) return null

    const result = await query(
        'SELECT id, email, name, created_at, risk_profile, investment_goal, investment_period FROM users WHERE id = $1',
        [decoded.id]
    )

    const user = result.rows[0]
    if (!user) return null

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: new Date(user.created_at),
        risk_profile: user.risk_profile,
        investment_goal: user.investment_goal,
        investment_period: user.investment_period,
    }
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateUserProfile(id: string, updates: Partial<User>) {
    const fields = Object.keys(updates)
    const values = Object.values(updates)
    
    if (fields.length === 0) return
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
    
    const result = await query(
        `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...values]
    )

    return result.rows[0]
}
