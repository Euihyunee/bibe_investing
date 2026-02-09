'use client'

import React from 'react'
import styled from 'styled-components'
import { DashboardContainer, DashboardHeader } from '@/shared/ui/styled/MainLayout.styled'
import { usePortfolio } from '@/features/portfolio/model/usePortfolio'
import { Button } from '@/shared/ui/styled'

const TableContainer = styled.div`
    width: 100%;
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    margin-top: 24px;
`

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    text-align: left;
`

const Th = styled.th`
    padding: 16px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
`

const Td = styled.td`
    padding: 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
    color: #111827;
`

const EmptyState = styled.div`
    padding: 60px;
    text-align: center;
    color: #6b7280;
`

export default function PortfolioPage() {
    const { holdings, isLoading, removeItem, summary } = usePortfolio()

    if (isLoading) return <DashboardContainer>불러오는 중...</DashboardContainer>

    return (
        <DashboardContainer>
            <DashboardHeader>
                <h1>내 포트폴리오</h1>
                <p>총 자산: ₩{summary.totalValue.toLocaleString()}</p>
            </DashboardHeader>

            <TableContainer>
                {holdings.length === 0 ? (
                    <EmptyState>
                        아직 등록된 자산이 없습니다. 대시보드에서 종목을 추가해보세요!
                    </EmptyState>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <Th>종목명</Th>
                                <Th>시장</Th>
                                <Th>보유 수량</Th>
                                <Th>평균 단가</Th>
                                <Th>현재가</Th>
                                <Th>평가 금액</Th>
                                <Th>수익률</Th>
                                <Th>관리</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((h) => (
                                <tr key={h.id}>
                                    <Td>
                                        <div style={{ fontWeight: '600' }}>{h.name}</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{h.symbol}</div>
                                    </Td>
                                    <Td>{h.market}</Td>
                                    <Td>{Number(h.quantity).toLocaleString()}주</Td>
                                    <Td>
                                        {h.currency === 'USD' ? '$' : '₩'}
                                        {Number(h.average_price).toLocaleString(undefined, {
                                            minimumFractionDigits: h.currency === 'USD' ? 2 : 0,
                                            maximumFractionDigits: h.currency === 'USD' ? 2 : 0
                                        })}
                                    </Td>
                                    <Td>
                                        {h.currency === 'USD' ? '$' : '₩'}
                                        {h.current_price?.toLocaleString(undefined, {
                                            minimumFractionDigits: h.currency === 'USD' ? 2 : 0,
                                            maximumFractionDigits: h.currency === 'USD' ? 2 : 0
                                        }) || '-'}
                                    </Td>
                                    <Td style={{ fontWeight: '600' }}>
                                        <div>
                                            {h.currency === 'USD' ? '$' : '₩'}
                                            {h.value?.toLocaleString(undefined, {
                                                minimumFractionDigits: h.currency === 'USD' ? 2 : 0,
                                                maximumFractionDigits: h.currency === 'USD' ? 2 : 0
                                            }) || '-'}
                                        </div>
                                        {h.currency === 'USD' && (
                                            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '400' }}>
                                                ₩{(h.value * summary.exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </div>
                                        )}
                                    </Td>
                                    <Td style={{
                                        color: h.returnPercentage > 0 ? '#10b981' : h.returnPercentage < 0 ? '#ef4444' : '#111827',
                                        fontWeight: '700'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>
                                                {h.returnPercentage > 0 ? '+' : ''}
                                                {h.returnPercentage?.toFixed(2)}%
                                            </span>
                                            <span style={{ fontSize: '12px', fontWeight: '400', opacity: 0.8 }}>
                                                {h.currency === 'USD' ? '$' : '₩'}
                                                {h.return?.toLocaleString(undefined, { maximumFractionDigits: h.currency === 'USD' ? 2 : 0 })}
                                            </span>
                                        </div>
                                    </Td>
                                    <Td>
                                        <Button
                                            $variant="secondary"
                                            style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444' }}
                                            onClick={() => {
                                                if (confirm('정말 삭제하시겠습니까?')) removeItem(h.id)
                                            }}
                                        >
                                            삭제
                                        </Button>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </TableContainer>
        </DashboardContainer>
    )
}
