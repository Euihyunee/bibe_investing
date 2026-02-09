'use client'

import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/features/auth/model/useAuth'

const SidebarContainer = styled.aside`
    width: 260px;
    height: 100vh;
    background-color: #ffffff;
    border-right: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    z-index: 100;

    @media (max-width: 768px) {
        display: none;
    }
`

const LogoSection = styled.div`
    padding: 32px 24px;
    font-size: 24px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors?.primary || '#3b82f6'};
    letter-spacing: -1px;
`

const NavSection = styled.nav`
    flex: 1;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
`

const NavItem = styled(Link) <{ $active?: boolean }>`
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    color: ${props => props.$active ? '#3b82f6' : '#4b5563'};
    background-color: ${props => props.$active ? '#eff6ff' : 'transparent'};
    font-weight: ${props => props.$active ? '600' : '500'};
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
        background-color: ${props => props.$active ? '#eff6ff' : '#f3f4f6'};
        color: ${props => props.$active ? '#3b82f6' : '#111827'};
    }
`

const UserSection = styled.div`
    padding: 24px;
    border-top: 1px solid #f3f4f6;
    display: flex;
    flex-direction: column;
    gap: 12px;
`

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`

const UserName = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: #111827;
`

const UserEmail = styled.span`
    font-size: 12px;
    color: #6b7280;
`

const LogoutButton = styled.button`
    padding: 8px;
    font-size: 13px;
    color: #ef4444;
    background: #fef2f2;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;

    &:hover {
        background: #fee2e2;
    }
`

export const Sidebar = () => {
    const pathname = usePathname()
    const { signOut, user: authUser, isLoading } = useAuth()

    // 로딩 중이거나 사용자가 없는 경우의 정보 표시 준비
    const displayUser = {
        name: authUser?.name || (isLoading ? '불러오는 중...' : '로그인 필요'),
        email: authUser?.email || (isLoading ? '' : '서비스를 이용하려면 로그인하세요')
    }

    const menuItems = [
        { name: '대시보드', path: '/', icon: '🏠' },
        { name: '내 포트폴리오', path: '/portfolio', icon: '📊' },
        { name: '시장 탐색', path: '/market', icon: '🌐' },
        { name: 'AI 리포트', path: '/ai-reports', icon: '🤖' },
        { name: '설정', path: '/settings', icon: '⚙️' },
    ]

    return (
        <SidebarContainer>
            <Link href="/" style={{ textDecoration: 'none' }}>
                <LogoSection>GlobalFlow</LogoSection>
            </Link>

            <NavSection>
                {menuItems.map((item) => (
                    <NavItem
                        key={item.path}
                        href={item.path}
                        $active={pathname === item.path}
                    >
                        <span style={{ marginRight: '12px' }}>{item.icon}</span>
                        {item.name}
                    </NavItem>
                ))}
            </NavSection>

            <UserSection>
                <UserInfo>
                    <UserName>{displayUser.name}</UserName>
                    <UserEmail>{displayUser.email}</UserEmail>
                </UserInfo>
                {authUser ? (
                    <LogoutButton onClick={signOut}>로그아웃</LogoutButton>
                ) : (
                    !isLoading && (
                        <Link href="/auth/login" passHref style={{ textDecoration: 'none' }}>
                            <LogoutButton style={{ background: '#3b82f6', color: 'white', width: '100%' }}>로그인하기</LogoutButton>
                        </Link>
                    )
                )}
            </UserSection>
        </SidebarContainer>
    )
}
