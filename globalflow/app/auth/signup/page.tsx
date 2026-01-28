/**
 * 회원가입 페이지 (styled-components 버전)
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    AuthContainer,
    AuthBox,
    LogoSection,
    LogoTitle,
    LogoSubtitle,
    Card,
    CardTitle,
    CardDescription,
    Label,
    Input,
    InputGroup,
    HelperText,
    Button,
    FooterText,
    TextLink,
} from '@/shared/ui/styled'

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // 비밀번호 확인 검증
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다')
            return
        }

        if (password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다')
            return
        }

        setIsLoading(true)

        // TODO: 실제 회원가입 로직 구현
        console.log('Signup:', name, email, password)

        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    return (
        <AuthContainer>
            <AuthBox>
                <LogoSection>
                    <LogoTitle>GlobalFlow</LogoTitle>
                    <LogoSubtitle>글로벌 주식 투자 플랫폼</LogoSubtitle>
                </LogoSection>

                <Card>
                    <CardTitle>회원가입</CardTitle>
                    <CardDescription>
                        GlobalFlow 계정을 만들어 글로벌 투자를 시작하세요
                    </CardDescription>

                    <form onSubmit={handleSubmit}>
                        <InputGroup>
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="홍길동"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <HelperText>최소 6자 이상</HelperText>
                        </InputGroup>

                        <InputGroup>
                            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {error && <HelperText $error>{error}</HelperText>}
                        </InputGroup>

                        <Button type="submit" $fullWidth disabled={isLoading}>
                            {isLoading ? '가입 중...' : '회원가입'}
                        </Button>
                    </form>

                    <FooterText>
                        이미 계정이 있으신가요?{' '}
                        <Link href="/auth/login" passHref legacyBehavior>
                            <TextLink>로그인</TextLink>
                        </Link>
                    </FooterText>
                </Card>
            </AuthBox>
        </AuthContainer>
    )
}
