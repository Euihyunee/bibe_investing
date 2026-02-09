'use client'

import React from 'react'
import styled from 'styled-components'
import { Card, CardTitle, CardDescription } from '@/shared/ui/styled'
import { usePortfolio } from '@/features/portfolio/model/usePortfolio'

const SummaryGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 16px;
`

const StatCard = styled.div`
    padding: 16px;
    background: #f9fafb;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
`

const StatLabel = styled.span`
    font-size: 14px;
    color: #6b7280;
`

const StatValue = styled.span<{ $positive?: boolean; $negative?: boolean }>`
    font-size: 20px;
    font-weight: 700;
    color: ${props => {
        if (props.$positive) return '#10b981'
        if (props.$negative) return '#ef4444'
        return '#111827'
    }};
`

const StatusBadge = styled.span<{ $active: boolean }>`
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 12px;
    background: ${props => props.$active ? '#f0fdf4' : '#fff7ed'};
    color: ${props => props.$active ? '#16a34a' : '#ea580c'};
    border: 1px solid ${props => props.$active ? '#bbf7d0' : '#ffedd5'};
    display: flex;
    align-items: center;
    gap: 4px;
`

/**
 * 포트폴리오 요약 위젯
 */
export const PortfolioSummary = () => {
    const { summary, isLoading } = usePortfolio()

    if (isLoading) {
        return (
            <Card>
                <CardTitle>포트폴리오 요약</CardTitle>
                <CardDescription>데이터를 불러오는 중입니다...</CardDescription>
                <SummaryGrid>
                    <StatCard>
                        <StatLabel>총 자산</StatLabel>
                        <StatValue>₩-</StatValue>
                    </StatCard>
                </SummaryGrid>
            </Card>
        )
    }

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                    <CardTitle>포트폴리오 요약</CardTitle>
                    <CardDescription>현재 내 자산 현황과 투자 수익률입니다.</CardDescription>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <StatusBadge $active={summary.isRealtime}>
                        {summary.isRealtime ? '● 실시간' : '⚠ 시뮬레이션'}
                    </StatusBadge>
                    {!summary.isRealtime && summary.lastUpdatedAt && (
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                            마지막 업데이트: {new Date(summary.lastUpdatedAt).toLocaleString('ko-KR', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                    )}
                </div>
            </div>

            <SummaryGrid>
                <StatCard>
                    <StatLabel>총 자산 (₩ 환산)</StatLabel>
                    <StatValue>₩{summary.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</StatValue>
                    {summary.totalUSD > 0 && (
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                            보유 달러: ${summary.totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            <span style={{ marginLeft: '8px' }}>(환율: ₩{summary.exchangeRate?.toFixed(1)})</span>
                        </div>
                    )}
                </StatCard>
                <StatCard>
                    <StatLabel>평가 손익</StatLabel>
                    <StatValue $positive={summary.totalReturn > 0} $negative={summary.totalReturn < 0}>
                        {summary.totalReturn > 0 ? '+' : ''}₩{summary.totalReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>투자 수익률</StatLabel>
                    <StatValue $positive={summary.returnPercentage > 0} $negative={summary.returnPercentage < 0}>
                        {summary.returnPercentage > 0 ? '+' : ''}
                        {summary.returnPercentage.toFixed(2)}%
                    </StatValue>
                </StatCard>
            </SummaryGrid>
        </Card>
    )
}
