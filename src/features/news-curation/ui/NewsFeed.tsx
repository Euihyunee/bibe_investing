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

import { getLatestNews } from '@/entities/news/api/newsApi'

// ========== 스타일 ==========

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  white-space: nowrap;
  background: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.background.secondary};
  color: ${({ theme, $active }) => $active ? 'white' : theme.colors.text.secondary};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme, $active }) => $active ? 'white' : theme.colors.primary};
  }
`

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
    const [articles, setArticles] = useState<any[]>([])
    const [aiSummary, setAiSummary] = useState<AIContentSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeRegion, setActiveRegion] = useState('Global')

    const regions = [
        { id: 'Global', label: '🌍 전체' },
        { id: 'US', label: '🇺🇸 미국' },
        { id: 'KR', label: '🇰🇷 한국' },
        { id: 'CN', label: '🇨🇳 중국' },
        { id: 'JP', label: '🇯🇵 일본' }
    ]

    const fetchData = async (region: string) => {
        setLoading(true)
        try {
            // 1. 국가별 뉴스 로드
            const newsData = await getLatestNews(region)
            setArticles(newsData)

            // 2. 임시 AI 요약 생성 (나중에 실제 AI API 연동 가능)
            // 뉴스 제목들을 기반으로 간단한 인사이트 시뮬레이션
            setAiSummary({
                sentiment: region === 'US' ? 'positive' : 'neutral',
                summary: `${region} 시장의 최신 뉴스를 분석한 결과, 주요 지표들의 움직임과 정책 변화가 감지되고 있습니다. 투자자들은 시장의 변동성에 유의하며 분산 투자 전략을 유지하는 것이 권장됩니다.`,
                keywords: [region, '시장성장', '리스크관리'],
                impact_score: 7
            })
        } catch (error) {
            console.error('News fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(activeRegion)
    }, [activeRegion])

    return (
        <Card>
            <CardHeader>
                <Flex $justify="space-between" $align="center" style={{ width: '100%' }}>
                    <CardTitle>AI 뉴스 큐레이션</CardTitle>
                    {!loading && aiSummary && (
                        <SentimentBadge $sentiment={aiSummary.sentiment}>
                            {aiSummary.sentiment === 'positive' ? '긍정적' : aiSummary.sentiment === 'negative' ? '부정적' : '중립적'}
                        </SentimentBadge>
                    )}
                </Flex>
            </CardHeader>
            <CardContent>
                <Tabs>
                    {regions.map(reg => (
                        <Tab
                            key={reg.id}
                            $active={activeRegion === reg.id}
                            onClick={() => setActiveRegion(reg.id)}
                        >
                            {reg.label}
                        </Tab>
                    ))}
                </Tabs>

                {loading ? (
                    <>
                        <Skeleton $height="100px" />
                        <NewsList style={{ marginTop: '20px' }}>
                            {[1, 2, 3].map(i => <Skeleton key={i} $height="40px" />)}
                        </NewsList>
                    </>
                ) : (
                    <>
                        {aiSummary && (
                            <AIInsightBox $sentiment={aiSummary.sentiment}>
                                <div style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    ✨ {activeRegion} AI 인사이트
                                    <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#666' }}>
                                        (영향도: {aiSummary.impact_score}/10)
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#333' }}>
                                    {aiSummary.summary}
                                </p>
                                <KeywordList>
                                    {aiSummary.keywords.map(kw => (
                                        <Keyword key={kw}>#{kw}</Keyword>
                                    ))}
                                </KeywordList>
                            </AIInsightBox>
                        )}

                        <NewsList>
                            {articles.map(article => (
                                <NewsItem key={article.id} href={article.link} target="_blank">
                                    <NewsHeadline>{article.title}</NewsHeadline>
                                    <NewsMeta>
                                        <span style={{ color: '#3b82f6', fontWeight: 600 }}>{article.source}</span>
                                        <span>•</span>
                                        <span>{article.time}</span>
                                    </NewsMeta>
                                </NewsItem>
                            ))}
                            {articles.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                                    표시할 뉴스가 없습니다.
                                </div>
                            )}
                        </NewsList>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
