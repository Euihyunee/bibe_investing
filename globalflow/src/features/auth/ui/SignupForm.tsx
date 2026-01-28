/**
 * 회원가입 폼 컴포넌트
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/ui/card'
import { signUp } from '@/entities/user/api/authApi'

export function SignupForm() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // 비밀번호 확인
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.')
            setLoading(false)
            return
        }

        // 비밀번호 길이 확인
        if (password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다.')
            setLoading(false)
            return
        }

        try {
            await signUp(email, password, name)
            // 회원가입 성공 후 프로필 설정 페이지로 이동
            router.push('/auth/profile-setup')
        } catch (err) {
            setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>회원가입</CardTitle>
                <CardDescription>
                    GlobalFlow 계정을 만들어 글로벌 투자를 시작하세요
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            이름
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="홍길동"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            이메일
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            비밀번호
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                        <p className="text-xs text-muted-foreground">
                            최소 6자 이상
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            비밀번호 확인
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? '가입 중...' : '회원가입'}
                    </Button>
                    <div className="text-sm text-center text-muted-foreground">
                        이미 계정이 있으신가요?{' '}
                        <a href="/auth/login" className="text-primary hover:underline">
                            로그인
                        </a>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
