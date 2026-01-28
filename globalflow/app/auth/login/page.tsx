/**
 * 로그인 페이지 (styled-components 버전)
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
    Button,
    FooterText,
    TextLink,
} from '@/shared/ui/styled'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // TODO: 실제 로그인 로직 구현
        console.log('Login:', email, password)

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
                    <CardTitle>로그인</CardTitle>
                    <CardDescription>
                        GlobalFlow 계정으로 로그인하세요
                    </CardDescription>

                    <form onSubmit={handleSubmit}>
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
                        </InputGroup>

                        <Button type="submit" $fullWidth disabled={isLoading}>
                            {isLoading ? '로그인 중...' : '로그인'}
                        </Button>
                    </form>

                    <FooterText>
                        계정이 없으신가요?{' '}
                        <Link href="/auth/signup" passHref legacyBehavior>
                            <TextLink>회원가입</TextLink>
                        </Link>
                    </FooterText>
                </Card>
            </AuthBox>
        </AuthContainer>
    )
}
