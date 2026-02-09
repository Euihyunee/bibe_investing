/**
 * AI API 클라이언트 (Google Gemini)
 * 뉴스 요약 및 감성 분석 기능 제공
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { NewsArticle, AIContentSummary, ApiResponse } from './types'

/**
 * Gemini API 키 가져오기
 */
function getGeminiApiKey(): string {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        console.warn('GEMINI_API_KEY가 설정되지 않았습니다.')
        return ''
    }
    return apiKey
}

/**
 * Gemini 모델 인스턴스 생성
 */
const genAI = new GoogleGenerativeAI(getGeminiApiKey())
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

/**
 * 뉴스 기사 요약 및 감성 분석
 * @param articles 요약할 뉴스 기사 배열
 * @param symbol 관련 종목 (옵션)
 */
export async function summarizeNews(
    articles: NewsArticle[],
    symbol?: string
): Promise<ApiResponse<AIContentSummary>> {
    try {
        const apiKey = getGeminiApiKey()
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured')
        }

        if (articles.length === 0) {
            return { success: false, error: '분석할 뉴스 기사가 없습니다' }
        }

        // 뉴스 기사들을 하나의 텍스트로 결합
        const articlesText = articles
            .map((a, i) => `[기사 ${i + 1}] 제목: ${a.headline}\n내용: ${a.summary}`)
            .join('\n\n')

        const prompt = `
            다음은 ${symbol ? `${symbol} 종목과 관련된` : '시장'} 뉴스 기사들입니다. 
            이 내용들을 종합하여 투자자에게 도움이 될 수 있도록 다음 형식의 JSON 데이터로 응답해주세요.
            반드시 한국어로 작성하세요.

            형식:
            {
                "summary": "전체 내용을 2~3문장으로 요약한 한국어 텍스트",
                "sentiment": "positive" | "negative" | "neutral",
                "impact_score": 1에서 10 사이의 숫자 (시장에 미치는 영향도),
                "keywords": ["핵심", "키워드", "3~5개"]
            }

            분석할 기사 내용:
            ${articlesText}
        `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        // JSON 추출 (코드 블록 제거 등)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('AI 응답을 파싱할 수 없습니다')
        }

        const analysis = JSON.parse(jsonMatch[0]) as AIContentSummary

        return {
            success: true,
            data: analysis
        }
    } catch (error) {
        console.error('AI 분석 오류:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}
