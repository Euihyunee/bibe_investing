'use client'

import React from 'react'
import { DashboardContainer, DashboardHeader } from '@/shared/ui/styled/MainLayout.styled'

export default function SettingsPage() {
    return (
        <DashboardContainer>
            <DashboardHeader>
                <h1>설정</h1>
                <p>계정 정보 및 서비스 환경을 설정합니다.</p>
            </DashboardHeader>
            <div style={{ padding: '40px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>사용자 프로필</h3>
                    <p style={{ color: '#6b7280' }}>이름, 이메일 등의 기본 정보를 수정할 수 있습니다 (준비 중).</p>
                </div>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>알림 설정</h3>
                    <p style={{ color: '#6b7280' }}>주요 시장 알림 및 AI 리포트 수신 설정을 관리합니다.</p>
                </div>
            </div>
        </DashboardContainer>
    )
}
