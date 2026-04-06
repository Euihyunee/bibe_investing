import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signUp as apiSignUp, signIn as apiSignIn, signOut as apiSignOut, getCurrentUser } from '@/entities/user/api/authApi'
import { User } from '@/shared/types'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // 로컬 스토리지 또는 쿠키에서 토큰 확인 및 사용자 정보 조회
        const checkUser = async () => {
            setIsLoading(true)
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
                if (token) {
                    const currentUser = await getCurrentUser(token)
                    setUser(currentUser)
                } else {
                    setUser(null)
                }
            } catch (err) {
                console.error('사용자 확인 오류:', err)
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        checkUser()
    }, [])

    /**
     * 회원가입 실행
     */
    const signUp = async (email: string, password: string, name: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await apiSignUp(email, password, name)
            if (result.user) {
                router.push('/auth/login')
                return { success: true }
            }
            return { success: false, error: '회원가입에 실패했습니다.' }
        } catch (err: any) {
            const message = err.message || '회원가입 중 오류가 발생했습니다.'
            setError(message)
            return { success: false, error: message }
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * 로그인 실행
     */
    const signIn = async (email: string, password: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await apiSignIn(email, password)
            if (result.session?.access_token) {
                // 토큰 저장
                localStorage.setItem('auth_token', result.session.access_token)
                setUser(result.user)
                router.push('/')
                router.refresh()
                return { success: true }
            }
            return { success: false, error: '로그인에 실패했습니다.' }
        } catch (err: any) {
            const message = err.message || '로그인 중 오류가 발생했습니다.'
            setError(message)
            return { success: false, error: message }
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * 로그아웃 실행
     */
    const signOut = async () => {
        setIsLoading(true)
        try {
            await apiSignOut()
            localStorage.removeItem('auth_token')
            setUser(null)
            router.push('/auth/login')
            router.refresh()
        } catch (err: any) {
            setError(err.message || '로그아웃 중 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        user,
        isLoading,
        error,
        signUp,
        signIn,
        signOut,
    }
}
