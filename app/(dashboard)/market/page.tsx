'use client'

import React from 'react'
import { DashboardContainer, DashboardHeader } from '@/shared/ui/styled/MainLayout.styled'

export default function MarketPage() {
    return (
        <DashboardContainer>
            <DashboardHeader>
                <h1>시장 탐색</h1>
                <p>글로벌 주요 종목과 시장 지수를 한눈에 확인하세요.</p>
            </DashboardHeader>
            <div style={{ padding: '40px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ color: '#6b7280' }}>글로벌 시장 데이터 연동 기능이 준비 중입니다.</p>
            </div>
        </DashboardContainer>
    )
}
