/**
 * AI 포트폴리오 최적화 및 리밸런싱 제안 컴포넌트
 */

'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardTitle, CardContent, Flex, Grid, Button } from '@/shared/ui/styled'
import { getPortfolioOptimization, type PortfolioOptimizationResult } from '../api/aiPortfolioActions'

// ========== 스타일 ==========

const OptimizerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`

const AssetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`

const AssetCard = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const WeightBarContainer = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin: ${({ theme }) => theme.spacing[2]} 0;
  position: relative;
`

const WeightBar = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  transition: width 1s ease-in-out;
`

const ScoreBadge = styled.div<{ $score: number }>`
  background: ${({ theme, $score }) => $score > 50 ? theme.colors.error : ($score > 20 ? theme.colors.warning : theme.colors.success)};
  color: white;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`

const MetricBox = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const RebalancingBox = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const TradeActionItem = styled.div<{ $action: 'BUY' | 'SELL' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-bottom: none; }

  .action-badge {
    color: ${({ theme, $action }) => $action === 'BUY' ? theme.colors.success : theme.colors.error};
    font-weight: 700;
    font-size: 0.75rem;
  }
`

const Skeleton = styled.div<{ $height?: string }>`
  width: 100%;
  height: ${({ $height }) => $height || '1.5rem'};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  animation: pulse 1.5s infinite ease-in-out;
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
`

// ========== 컴포넌트 ==========

export function PortfolioOptimizer() {
    const [result, setResult] = useState<PortfolioOptimizationResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        const res = await getPortfolioOptimization()
        if (res.success && res.data) {
            setResult(res.data)
        } else {
            setError(res.error || '분석 중 오류가 발생했습니다.')
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>AI 포트폴리오 최적화</CardTitle>
                </CardHeader>
                <CardContent>
                    <Grid $columns={3} $gap="1rem" style={{ marginBottom: '2rem' }}>
                        {[1, 2, 3].map(i => <Skeleton key={i} $height="80px" />)}
                    </Grid>
                    <AssetGrid>
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} $height="120px" />)}
                    </AssetGrid>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <Flex $direction="column" $align="center" $gap="1rem" style={{ padding: '2rem' }}>
                        <p style={{ color: '#ef4444' }}>{error}</p>
                        <Button onClick={fetchData}>다시 시도</Button>
                    </Flex>
                </CardContent>
            </Card>
        )
    }

    const rec = result?.rebalancingGuide

    return (
        <Card>
            <CardHeader>
                <Flex $justify="space-between" $align="center" style={{ width: '100%' }}>
                    <CardTitle>AI 포트폴리오 최적화 & 리밸런싱</CardTitle>
                    <Flex $gap="0.5rem">
                        <ScoreBadge $score={0}>샤프 지수: {result?.sharpeRatio.toFixed(2)}</ScoreBadge>
                        {rec && <ScoreBadge $score={rec.driftScore}>비중 괴리도: {rec.driftScore}</ScoreBadge>}
                    </Flex>
                </Flex>
            </CardHeader>
            <CardContent>
                <OptimizerContainer>
                    <Grid $columns={2} $gap="1.5rem">
                        <MetricBox>
                            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>예상 수익률 (연)</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                                {(result!.overallExpectedReturn * 100).toFixed(2)}%
                            </div>
                        </MetricBox>
                        <MetricBox>
                            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>포트폴리오 변동성</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3b82f6' }}>
                                {(result!.overallVolatility * 100).toFixed(2)}%
                            </div>
                        </MetricBox>
                    </Grid>

                    {/* 리밸런싱 가이드 카드 */}
                    {rec && rec.actions.length > 0 && (
                        <RebalancingBox>
                            <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🔄 AI 리밸런싱 가이드
                                {rec.needsRebalancing && <span style={{ fontSize: '0.7rem', background: '#fee2e2', color: '#ef4444', padding: '1px 6px', borderRadius: '4px' }}>실전 권장</span>}
                            </div>
                            <div style={{ fontSize: '0.875rem' }}>
                                {rec.actions.map(action => (
                                    <TradeActionItem key={action.symbol} $action={action.action as 'BUY' | 'SELL'}>
                                        <Flex $direction="column">
                                            <span style={{ fontWeight: 500 }}>{action.name}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#888' }}>{action.symbol}</span>
                                        </Flex>
                                        <Flex $gap="1rem" $align="center">
                                            <span className="action-badge">{action.action === 'BUY' ? '매수' : '매도'}</span>
                                            <span style={{ fontWeight: 600 }}>{action.quantity}주</span>
                                            <span style={{ fontSize: '0.75rem', color: '#666', width: '80px', textAlign: 'right' }}>
                                                약 ₩{(action.estimatedValue).toLocaleString()}
                                            </span>
                                        </Flex>
                                    </TradeActionItem>
                                ))}
                            </div>
                            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888', textAlign: 'right' }}>
                                * 현재가 기준 예상 주문량입니다. 시장 상황에 따라 실제 주문액은 달라질 수 있습니다.
                            </div>
                        </RebalancingBox>
                    )}

                    <div style={{ marginTop: '0.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>자산별 목표 비중</h4>
                        <AssetGrid>
                            {result?.assets.map(asset => (
                                <AssetCard key={asset.symbol}>
                                    <Flex $justify="space-between" style={{ marginBottom: '0.5rem' }}>
                                        <div style={{ fontWeight: 600 }}>{asset.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{asset.symbol}</div>
                                    </Flex>

                                    <div style={{ fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>현재: {(asset.currentWeight * 100).toFixed(1)}%</span>
                                        <span style={{ fontWeight: 700, color: '#6366f1' }}>목표: {(asset.suggestedWeight * 100).toFixed(1)}%</span>
                                    </div>

                                    <WeightBarContainer>
                                        <WeightBar
                                            $width={asset.suggestedWeight * 100}
                                            $color="#6366f1"
                                        />
                                    </WeightBarContainer>
                                </AssetCard>
                            ))}
                        </AssetGrid>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        <p style={{ color: '#64748b', lineHeight: 1.5 }}>
                            💡 <strong>투자 팁:</strong> 목표 비중으로 자산을 재조정하면 균형 잡힌 포트폴리오를 유지할 수 있습니다.
                            괴리도가 높을수록(50점 이상) 리밸런싱을 통한 리스크 관리를 적극 권장합니다.
                        </p>
                    </div>
                </OptimizerContainer>
            </CardContent>
        </Card>
    )
}
