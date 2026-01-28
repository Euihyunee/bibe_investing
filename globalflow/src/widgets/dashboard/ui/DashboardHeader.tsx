/**
 * 대시보드 헤더 컴포넌트
 */

'use client'

import { Button } from '@/shared/ui/button'
import { signOut } from '@/entities/user/api/authApi'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

interface DashboardHeaderProps {
    userName: string
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/login')
        } catch (error) {
            console.error('로그아웃 실패:', error)
        }
    }

    return (
        <header className="bg-white border-b sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        GlobalFlow
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{userName}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            로그아웃
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
