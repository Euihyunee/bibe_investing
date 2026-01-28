/**
 * 사용자 인증 상태를 관리하는 React Hook
 * Supabase Auth 세션을 추적하고 사용자 정보를 제공합니다.
 */

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/shared/api/supabase'
import type { User } from '@/shared/types'
import { getCurrentUser } from '@/entities/user/api/authApi'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 초기 사용자 정보 가져오기
        getCurrentUser().then((user) => {
            setUser(user)
            setLoading(false)
        })

        // 인증 상태 변경 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    const user = await getCurrentUser()
                    setUser(user)
                } else {
                    setUser(null)
                }
                setLoading(false)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return { user, loading, isAuthenticated: !!user }
}
