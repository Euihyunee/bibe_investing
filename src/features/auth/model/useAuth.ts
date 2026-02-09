import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/shared/api/supabase'
import { signUp as apiSignUp, signIn as apiSignIn, signOut as apiSignOut } from '@/entities/user/api/authApi'
import { User } from '@/shared/types'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // 현재 세션 확인
        const checkUser = async () => {
            setIsLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                // User 타입에 맞게 매핑 (필요 시)
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || '',
                    created_at: new Date(session.user.created_at)
                })
            } else {
                setUser(null)
            }
            setIsLoading(false)
        }

        checkUser()

        // 인증 상태 변경 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || '',
                    created_at: new Date(session.user.created_at)
                })
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    /**
     * 회원가입 실행
     */
    const signUp = async (email: string, password: string, name: string) => {
        setIsLoading(true)
        setError(null)
        try {
            await apiSignUp(email, password, name)
            router.push('/')
            return { success: true }
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
            await apiSignIn(email, password)
            router.push('/')
            router.refresh()
            return { success: true }
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
