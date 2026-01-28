/**
 * 뉴스 큐레이션 관련 Server Actions
 */

'use server'

import { getMarketNews, getCompanyNews, summarizeNews } from '@/shared/api'
import type { NewsArticle, AIContentSummary, ApiResponse } from '@/shared/api'

/**
 * 대시보드용 시장 뉴스 요약 조회
 */
export async function getMarketNewsSummary(): Promise<ApiResponse<{ articles: NewsArticle[], aiSummary: AIContentSummary | null }>> {
    try {
        // 1. 최신 시장 뉴스 조회
        const newsResult = await getMarketNews('general')
        if (!newsResult.success || !newsResult.data) {
            return { success: false, error: newsResult.error }
        }

        const articles = newsResult.data

        // 2. AI 요약 생성
        const aiResult = await summarizeNews(articles)

        return {
            success: true,
            data: {
                articles,
                aiSummary: aiResult.success ? aiResult.data! : null
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 특정 종목 주주용 뉴스 요약 조회
 */
export async function getStockNewsSummary(symbol: string): Promise<ApiResponse<{ articles: NewsArticle[], aiSummary: AIContentSummary | null }>> {
    try {
        // 날짜 범위 설정 (최근 7일)
        const to = new Date().toISOString().split('T')[0]
        const fromDate = new Date()
        fromDate.setDate(fromDate.getDate() - 7)
        const from = fromDate.toISOString().split('T')[0]

        // 1. 종목 뉴스 조회
        const newsResult = await getCompanyNews(symbol, from, to)
        if (!newsResult.success || !newsResult.data) {
            return { success: false, error: newsResult.error }
        }

        const articles = newsResult.data

        // 2. AI 요약 생성
        const aiResult = await summarizeNews(articles, symbol)

        return {
            success: true,
            data: {
                articles,
                aiSummary: aiResult.success ? aiResult.data! : null
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}
