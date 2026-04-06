import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/entities/user/api/authApi'

/**
 * 현재 로그인한 사용자 정보 반환 API
 * 클라이언트 컴포넌트(useAuth 등)에서 사용합니다.
 */
export async function GET() {
    try {
        const user = await getCurrentUser()
        
        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 })
        }

        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        console.error('Auth API Error:', error)
        return NextResponse.json(
            { error: '인증 정보를 가져오는 중 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}
