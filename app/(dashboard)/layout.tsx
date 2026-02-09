'use client'

import React from 'react'
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar'
import { AppWrapper, MainContent } from '@/shared/ui/styled/MainLayout.styled'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 이제 useAuth의 로딩 상태를 레이아웃 전체가 기다리지 않고 
    // 사이드바 내부에서 처리하도록 하여 UX를 개선합니다.
    return (
        <AppWrapper>
            <Sidebar />
            <MainContent>
                {children}
            </MainContent>
        </AppWrapper>
    )
}
