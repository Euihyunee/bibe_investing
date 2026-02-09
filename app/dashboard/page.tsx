/**
 * 대시보드 페이지 (Supabase 포트폴리오 연동 버전)
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import {
    DashboardContainer,
    DashboardHeader,
    HeaderContent,
    DashboardMain,
    LogoTitle,
    Card,
    CardTitle,
    Grid,
    Flex,
    Button,
} from '@/shared/ui/styled'
import { AI뉴스Feed } from '@/features/news-curation'
import { PortfolioOptimizer } from '@/features/ai-advisor'
import { getAllMarketIndices, getMultipleQuotes } from '@/features/stock/api/stockActions'
import { getHoldings, addHolding } from '@/features/portfolio/api/portfolioActions'
import { AddHoldingModal } from '@/features/portfolio/ui/AddHoldingModal'
import type { MarketIndex, StockQuote } from '@/shared/api'
import type { Holding, CreateHoldingRequest } from '@/features/portfolio/types'

// ========== 스타일 컴포넌트 ==========

const MarketCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[4]};
`

const MarketLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`

const MarketValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`

const MarketChange = styled.div<{ $positive?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $positive }) =>
        $positive ? theme.colors.success : theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing[1]};
`

const PortfolioValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`

const StatValue = styled.div<{ $positive?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme, $positive }) =>
        $positive !== undefined
            ? ($positive ? theme.colors.success : theme.colors.error)
            : theme.colors.text.primary};
`

const HoldingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: background-color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
  
  & + & {
    margin-top: ${({ theme }) => theme.spacing[3]};
  }
`

const HoldingSymbol = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`

const HoldingName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`

const HoldingInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`

const ChartPlaceholder = styled.div`
  height: 16rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.muted};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`

const MarketBadge = styled.span<{ $market: 'US' | 'KR' | 'BRICS' }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ $market }) =>
        $market === 'US' ? '#3b82f6' :
            $market === 'KR' ? '#ef4444' : '#10b981'};
  color: white;
  margin-left: ${({ theme }) => theme.spacing[2]};
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.text.muted};
`

// ========== 타입 ==========

interface HoldingWithQuote extends Holding {
    currentPrice?: number
    priceChange?: number
    priceChangePercent?: number
}

// ========== 컴포넌트 ==========

export default function DashboardPage() {
    const [indices, setIndices] = useState<{ us: MarketIndex[]; kr: MarketIndex[] }>({ us: [], kr: [] })
    const [holdings, setHoldings] = useState<HoldingWithQuote[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 데이터 로드
    const loadData = useCallback(async () => {
        try {
            // 시장 지수 로드
            const indicesData = await getAllMarketIndices()
            setIndices(indicesData)

            // 보유 종목 로드 (Supabase)
            const holdingsResult = await getHoldings()

            if (holdingsResult.success && holdingsResult.data) {
                const dbHoldings = holdingsResult.data

                // 시세 조회
                if (dbHoldings.length > 0) {
                    const quotesResult = await getMultipleQuotes(
                        dbHoldings.map(h => ({
                            symbol: h.symbol,
                            market: h.market as 'US' | 'KR'
                        }))
                    )

                    // 시세 데이터 병합
                    const holdingsWithQuotes: HoldingWithQuote[] = dbHoldings.map((holding, index) => {
                        const quote = quotesResult.data?.[index]
                        return {
                            ...holding,
                            currentPrice: quote?.price,
                            priceChange: quote?.change,
                            priceChangePercent: quote?.changePercent,
                        }
                    })

                    setHoldings(holdingsWithQuotes)
                } else {
                    setHoldings([])
                }
            }
        } catch (error) {
            console.error('데이터 로드 실패:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadData()

        // 30초마다 갱신
        const interval = setInterval(loadData, 30000)
        return () => clearInterval(interval)
    }, [loadData])

    // 종목 추가 핸들러
    const handleAddHolding = async (data: CreateHoldingRequest) => {
        const result = await addHolding(data)
        if (!result.success) {
            throw new Error(result.error || '종목 추가 실패')
        }
        // 데이터 새로고침
        await loadData()
    }

    // 포트폴리오 가치 계산
    const totalValue = holdings.reduce((sum, h) => {
        const price = h.currentPrice || h.average_price
        return sum + price * h.quantity
    }, 0)

    const totalCost = holdings.reduce((sum, h) =>
        sum + h.average_price * h.quantity, 0
    )

    const totalReturn = totalValue - totalCost
    const returnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0

    const handleLogout = () => {
        console.log('Logout')
    }

    // 숫자 포맷팅
    const formatNumber = (num: number) => num.toLocaleString('ko-KR')
    const formatCurrency = (num: number) => `₩${formatNumber(Math.round(num))}`
    const formatPercent = (num: number) => `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`

    return (
        <DashboardContainer>
            {/* 헤더 */}
            <DashboardHeader>
                <HeaderContent>
                    <LogoTitle as="h1" style={{ fontSize: '1.5rem' }}>
                        GlobalFlow
                    </LogoTitle>
                    <Flex $align="center" $gap="1rem">
                        <UserName>환영합니다</UserName>
                        <Button $variant="outline" $size="sm" onClick={handleLogout}>
                            로그아웃
                        </Button>
                    </Flex>
                </HeaderContent>
            </DashboardHeader>

            {/* 메인 콘텐츠 */}
            <DashboardMain>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* 뉴스 피드 */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <AI뉴스Feed />
                    </div>
                    {/* 시장 지수 및 AI 최적화 */}
                    <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <PortfolioOptimizer />
                    </div>
                </div>

                {/* 시장 현황 (기존 지수 섹션) */}
                <Grid $cols={4} $gap="1rem" style={{ marginBottom: '1.5rem' }}>
                    {loading ? (
                        <MarketCard>
                            <LoadingText>로딩 중...</LoadingText>
                        </MarketCard>
                    ) : (
                        <>
                            {/* 미국 지수 */}
                            {indices.us.map(index => (
                                <MarketCard key={index.symbol}>
                                    <MarketLabel>
                                        {index.name}
                                        <MarketBadge $market="US">US</MarketBadge>
                                    </MarketLabel>
                                    <MarketValue>${formatNumber(index.value)}</MarketValue>
                                    <MarketChange $positive={index.changePercent >= 0}>
                                        {formatPercent(index.changePercent)}
                                    </MarketChange>
                                </MarketCard>
                            ))}

                            {/* 한국 지수 */}
                            {indices.kr.map(index => (
                                <MarketCard key={index.symbol}>
                                    <MarketLabel>
                                        {index.name}
                                        <MarketBadge $market="KR">KR</MarketBadge>
                                    </MarketLabel>
                                    <MarketValue>{formatNumber(index.value)}</MarketValue>
                                    <MarketChange $positive={index.changePercent >= 0}>
                                        {formatPercent(index.changePercent)}
                                    </MarketChange>
                                </MarketCard>
                            ))}
                        </>
                    )}
                </Grid>

                {/* 포트폴리오 요약 & 차트 */}
                <Grid $cols={3}>
                    <Card>
                        <CardTitle>포트폴리오 요약</CardTitle>
                        <div style={{ marginBottom: '1rem' }}>
                            <StatLabel>총 자산</StatLabel>
                            <PortfolioValue>{formatCurrency(totalValue)}</PortfolioValue>
                        </div>
                        <Grid $cols={2} $gap="1rem">
                            <div>
                                <StatLabel>총 수익</StatLabel>
                                <StatValue $positive={totalReturn >= 0}>
                                    {formatCurrency(totalReturn)}
                                </StatValue>
                                <MarketChange $positive={returnPercent >= 0}>
                                    {formatPercent(returnPercent)}
                                </MarketChange>
                            </div>
                            <div>
                                <StatLabel>투자 원금</StatLabel>
                                <StatValue>{formatCurrency(totalCost)}</StatValue>
                            </div>
                        </Grid>
                    </Card>

                    <Card style={{ gridColumn: 'span 2' }}>
                        <CardTitle>자산 추이</CardTitle>
                        <ChartPlaceholder>
                            차트 영역 (recharts 연동 예정)
                        </ChartPlaceholder>
                    </Card>
                </Grid>

                {/* 보유 종목 */}
                <Card style={{ marginTop: '1.5rem' }}>
                    <CardHeader>
                        <CardTitle style={{ marginBottom: 0 }}>보유 종목</CardTitle>
                        <Button
                            $variant="primary"
                            $size="sm"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + 종목 추가
                        </Button>
                    </CardHeader>

                    {loading ? (
                        <LoadingText>로딩 중...</LoadingText>
                    ) : holdings.length === 0 ? (
                        <EmptyState>
                            <p style={{ marginBottom: '1rem' }}>보유 종목이 없습니다</p>
                            <Button
                                $variant="outline"
                                onClick={() => setIsModalOpen(true)}
                            >
                                첫 종목 추가하기
                            </Button>
                        </EmptyState>
                    ) : (
                        holdings.map(holding => {
                            const currentPrice = holding.currentPrice || holding.average_price
                            const returnAmount = (currentPrice - holding.average_price) * holding.quantity
                            const returnPct = ((currentPrice - holding.average_price) / holding.average_price) * 100

                            return (
                                <HoldingItem key={holding.id}>
                                    <div style={{ flex: 1 }}>
                                        <HoldingSymbol>
                                            {holding.symbol}
                                            <MarketBadge $market={holding.market}>{holding.market}</MarketBadge>
                                        </HoldingSymbol>
                                        {holding.name && (
                                            <HoldingName>{holding.name}</HoldingName>
                                        )}
                                        <HoldingInfo>
                                            {holding.quantity}주 · 평균 {formatCurrency(holding.average_price)}
                                        </HoldingInfo>
                                    </div>
                                    <div style={{ textAlign: 'right', marginRight: '1.5rem' }}>
                                        <div style={{ fontWeight: 500 }}>
                                            {holding.market === 'US'
                                                ? `$${formatNumber(currentPrice)}`
                                                : formatCurrency(currentPrice)}
                                        </div>
                                        {holding.priceChangePercent !== undefined && (
                                            <MarketChange $positive={holding.priceChangePercent >= 0}>
                                                {formatPercent(holding.priceChangePercent)}
                                            </MarketChange>
                                        )}
                                    </div>
                                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                        <StatValue $positive={returnAmount >= 0} style={{ fontSize: '1rem' }}>
                                            {formatCurrency(returnAmount)}
                                        </StatValue>
                                        <MarketChange $positive={returnPct >= 0}>
                                            {formatPercent(returnPct)}
                                        </MarketChange>
                                    </div>
                                </HoldingItem>
                            )
                        })
                    )}
                </Card>
            </DashboardMain>

            {/* 종목 추가 모달 */}
            <AddHoldingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddHolding}
            />
        </DashboardContainer>
    )
}
