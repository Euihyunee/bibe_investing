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
import { useAuth } from '@/features/auth/model/useAuth'

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [clientError, setClientError] = useState('')

    // useAuth 훅 사용
    const { signUp, isLoading, error: authError } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setClientError('')

        // 비밀번호 확인 검증
        if (password !== confirmPassword) {
            setClientError('비밀번호가 일치하지 않습니다')
            return
        }

        if (password.length < 6) {
            setClientError('비밀번호는 최소 6자 이상이어야 합니다')
            return
        }

        // 실제 회원가입 로직 호출
        await signUp(email, password, name)
    }

    // 표시할 에러 메시지 결정 (클라이언트 검증 에러 우선)
    const displayError = clientError || authError

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
                            {displayError && <HelperText $error>{displayError}</HelperText>}
                        </InputGroup>

                        <Button type="submit" $fullWidth disabled={isLoading}>
                            {isLoading ? '가입 중...' : '회원가입'}
                        </Button>
                    </form>

                    <FooterText>
                        이미 계정이 있으신가요?{' '}
                        <Link href="/auth/login" passHref>
                            <TextLink as="span">로그인</TextLink>
                        </Link>
                    </FooterText>
                </Card>
            </AuthBox>
        </AuthContainer>
    )
}
