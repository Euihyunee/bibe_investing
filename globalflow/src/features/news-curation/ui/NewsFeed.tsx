/**
 * AI 뉴스 피드 컴포넌트
 */

'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardTitle, CardContent, Flex, Grid } from '@/shared/ui/styled'
import type { NewsArticle, AIContentSummary } from '@/shared/api'
import { getMarketNewsSummary } from '../api/newsActions'

// ========== 스타일 ==========

const AIInsightBox = styled.div<{ $sentiment: 'positive' | 'negative' | 'neutral' }>`
  background: ${({ theme, $sentiment }) => {
        if ($sentiment === 'positive') return theme.colors.success + '10'
        if ($sentiment === 'negative') return theme.colors.error + '10'
        return theme.colors.background.secondary
    }};
  border-left: 4px solid ${({ theme, $sentiment }) => {
        if ($sentiment === 'positive') return theme.colors.success
        if ($sentiment === 'negative') return theme.colors.error
        return theme.colors.border
    }};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const SentimentBadge = styled.span<{ $sentiment: 'positive' | 'negative' | 'neutral' }>`
  padding: 0.25rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-transform: uppercase;
  background: ${({ theme, $sentiment }) => {
        if ($sentiment === 'positive') return theme.colors.success
        if ($sentiment === 'negative') return theme.colors.error
        return theme.colors.text.muted
    }};
  color: white;
`

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`

const Keyword = styled.span`
  background: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0.2rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`

const NewsItem = styled.a`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
  }
`

const NewsHeadline = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
`

const NewsMeta = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.muted};
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`

const Skeleton = styled.div<{ $height?: string }>`
  width: 100%;
  height: ${({ $height }) => $height || '1rem'};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  animation: pulse 1.5s infinite ease-in-out;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`

// ========== 컴포넌트 ==========

export function AI뉴스Feed() {
    const [data, setData] = useState<{ articles: NewsArticle[], aiSummary: AIContentSummary | null } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const result = await getMarketNewsSummary()
            if (result.success && result.data) {
                setData(result.data)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>AI 뉴스 큐레이션</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton $height="100px" />
                    <NewsList style={{ marginTop: '20px' }}>
                        {[1, 2, 3].map(i => <Skeleton key={i} $height="40px" />)}
                    </NewsList>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <Flex $justify="space-between" $align="center" style={{ width: '100%' }}>
                    <CardTitle>AI 뉴스 큐레이션</CardTitle>
                    {data?.aiSummary && (
                        <SentimentBadge $sentiment={data.aiSummary.sentiment}>
                            {data.aiSummary.sentiment === 'positive' ? '긍정적' : data.aiSummary.sentiment === 'negative' ? '부정적' : '중립적'}
                        </SentimentBadge>
                    )}
                </Flex>
            </CardHeader>
            <CardContent>
                {data?.aiSummary && (
                    <AIInsightBox $sentiment={data.aiSummary.sentiment}>
                        <div style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            ✨ AI 투자 인사이트
                            <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#666' }}>
                                (영향도: {data.aiSummary.impact_score}/10)
                            </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#333' }}>
                            {data.aiSummary.summary}
                        </p>
                        <KeywordList>
                            {data.aiSummary.keywords.map(kw => (
                                <Keyword key={kw}>#{kw}</Keyword>
                            ))}
                        </KeywordList>
                    </AIInsightBox>
                )}

                <NewsList>
                    {data?.articles.map(article => (
                        <NewsItem key={article.id} href={article.url} target="_blank">
                            <NewsHeadline>{article.headline}</NewsHeadline>
                            <NewsMeta>
                                <span>{article.source}</span>
                                <span>•</span>
                                <span>{new Date(article.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </NewsMeta>
                        </NewsItem>
                    ))}
                </NewsList>
            </CardContent>
        </Card>
    )
}
