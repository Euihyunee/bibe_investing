'use client'

import React from 'react'
import { DashboardContainer, DashboardHeader } from '@/shared/ui/styled/MainLayout.styled'

export default function AIReportsPage() {
    return (
        <DashboardContainer>
            <DashboardHeader>
                <h1>AI 투자 리포트</h1>
                <p>AI가 분석한 나의 포트폴리오 진단 및 투자 제안을 받아보세요.</p>
            </DashboardHeader>
            <div style={{ padding: '40px', background: '#f0fdf4', borderRadius: '16px', border: '1px solid #dcfce7', textAlign: 'center' }}>
                <p style={{ color: '#166534', fontWeight: 'bold' }}>🤖 AI 엔진 연결 중...</p>
                <p style={{ color: '#15803d', fontSize: '14px', marginTop: '8px' }}>개인별 맞춤형 투자 리포트 기능이 곧 공개됩니다.</p>
            </div>
        </DashboardContainer>
    )
}
