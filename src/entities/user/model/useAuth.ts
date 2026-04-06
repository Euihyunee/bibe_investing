'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/shared/types'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 클라이언트 사이드에서 API Route를 통해 사용자 정보 확인
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me')
                if (!response.ok) {
                    throw new Error('인증 정보를 가져올 수 없습니다.')
                }
                const data = await response.json()
                setUser(data.user || null)
            } catch (error) {
                console.error('인증 확인 중 오류 발생:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    return { user, loading, isAuthenticated: !!user, setUser }
}
