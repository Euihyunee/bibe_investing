'use client'

import React from 'react'
import Link from 'next/link'
import {
    DashboardContainer,
    DashboardHeader,
    DashboardGrid,
    WidgetSection,
    WidgetTitle,
} from '@/shared/ui/styled/MainLayout.styled'
import { Button } from '@/shared/ui/styled'
import { PortfolioSummary } from '@/widgets/portfolio-summary/ui/PortfolioSummary'
import { NewsFeed } from '@/widgets/news-feed/ui/NewsFeed'
import { AddStockWidget } from '@/widgets/add-stock/ui/AddStockWidget'
import { useAuth } from '@/features/auth/model/useAuth'

export default function DashboardPage() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>
                불러오는 중...
            </div>
        )
    }

    // 로그인하지 않은 경우 (이 레이아웃에 들어왔다면 접근 제어가 필요하지만, 우선 가이드 노출)
    if (!user) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '24px', padding: '20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>GlobalFlow에 오신 것을 환영합니다</h1>
                <p style={{ fontSize: '18px', color: '#666', maxWidth: '500px' }}>
                    나만의 글로벌 투자 포트폴리오를 관리하고 AI 가이드와 함께 현명하게 투자하세요.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href="/auth/login" passHref>
                        <Button $variant="primary">로그인하기</Button>
                    </Link>
                    <Link href="/auth/signup" passHref>
                        <Button>회원가입</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <DashboardContainer>
            <DashboardHeader>
                <div>
                    <h1>안녕하세요, {user.name}님!</h1>
                    <p style={{ color: '#6b7280', marginTop: '4px' }}>오늘의 글로벌 투자 현황을 확인하세요.</p>
                </div>
            </DashboardHeader>

            <DashboardGrid>
                <WidgetSection>
                    <WidgetTitle>내 자산 현황</WidgetTitle>
                    <PortfolioSummary />

                    <WidgetTitle>실시간 뉴스</WidgetTitle>
                    <NewsFeed />
                </WidgetSection>

                <WidgetSection>
                    <WidgetTitle>종목 관리</WidgetTitle>
                    <AddStockWidget />

                    <div style={{ padding: '24px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '16px', color: '#0369a1' }}>
                        <h4 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}>💡 오늘의 투자 인사이트</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            현재 미국 시장의 공포/탐욕 지수가 <b>65(탐욕)</b> 단계입니다. 급격한 추격 매수보다는 포트폴리오의 리스크 비중을 재점검하고 분할 매수 전략을 유지하는 것이 유리할 수 있습니다.
                        </p>
                    </div>
                </WidgetSection>
            </DashboardGrid>
        </DashboardContainer>
    )
}
