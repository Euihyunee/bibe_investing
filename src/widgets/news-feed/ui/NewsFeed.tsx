import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardTitle, CardDescription } from '@/shared/ui/styled'
import { getLatestNews } from '@/entities/news/api/newsApi'

const NewsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 16px 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const NewsItem = styled.li`
    padding-bottom: 16px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        opacity: 0.8;
        transform: translateX(4px);
    }

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
`

const NewsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 4px;
`

const NewsSource = styled.span`
    font-size: 11px;
    font-weight: 600;
    color: #3b82f6;
    background: #eff6ff;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;
`

const NewsTime = styled.span`
    font-size: 11px;
    color: #9ca3af;
`

const NewsLink = styled.a`
    text-decoration: none;
    color: inherit;
`

const NewsItemTitle = styled.h3`
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
    line-height: 1.4;
`

const NewsSummary = styled.p`
    font-size: 13px;
    color: #4b5563;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`

const LoadingPlaceholder = styled.div`
    padding: 20px;
    text-align: center;
    color: #94a3b8;
    font-size: 14px;
`

const Tabs = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    &::-webkit-scrollbar {
        height: 4px;
    }
    &::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 2px;
    }
`

const Tab = styled.button<{ $active?: boolean }>`
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;
    background: ${props => props.$active ? '#3b82f6' : '#f8fafc'};
    color: ${props => props.$active ? '#ffffff' : '#64748b'};
    border: 1px solid ${props => props.$active ? '#3b82f6' : '#e2e8f0'};

    &:hover {
        border-color: #3b82f6;
        color: ${props => props.$active ? '#ffffff' : '#3b82f6'};
    }
`

/**
 * 뉴스 피드 위젯
 */
export const NewsFeed = () => {
    const [news, setNews] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeRegion, setActiveRegion] = useState('Global')

    const regions = [
        { id: 'Global', label: '🌍 전체' },
        { id: 'US', label: '🇺🇸 미국' },
        { id: 'KR', label: '🇰🇷 한국' },
        { id: 'CN', label: '🇨🇳 중국' },
        { id: 'JP', label: '🇯🇵 일본' }
    ]

    const loadNews = async (region: string) => {
        setIsLoading(true)
        const data = await getLatestNews(region)
        setNews(data)
        setIsLoading(false)
    }

    useEffect(() => {
        loadNews(activeRegion)

        // 5분마다 뉴스 갱신
        const interval = setInterval(() => loadNews(activeRegion), 300000)
        return () => clearInterval(interval)
    }, [activeRegion])

    return (
        <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <CardTitle>시장 브리핑</CardTitle>
                    <CardDescription>국가별 실시간 주요 뉴스</CardDescription>
                </div>
            </div>

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

            {isLoading ? (
                <LoadingPlaceholder>뉴스를 분석하는 중입니다...</LoadingPlaceholder>
            ) : (
                <NewsList>
                    {news.map(item => (
                        <NewsItem key={item.id}>
                            <NewsLink href={item.link} target="_blank" rel="noopener noreferrer">
                                <NewsHeader>
                                    <NewsSource>{item.source}</NewsSource>
                                    <NewsTime>{item.time}</NewsTime>
                                </NewsHeader>
                                <NewsItemTitle>{item.title}</NewsItemTitle>
                                <NewsSummary>{item.summary}</NewsSummary>
                            </NewsLink>
                        </NewsItem>
                    ))}
                    {news.length === 0 && (
                        <LoadingPlaceholder>해당 국가의 실시간 뉴스를 찾는 데 실패했습니다.</LoadingPlaceholder>
                    )}
                </NewsList>
            )}
        </Card>
    )
}
