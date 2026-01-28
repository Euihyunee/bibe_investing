/**
 * AI 포트폴리오 관리 서버 액션
 */

'use server'

import { getHoldings } from '@/features/portfolio/api/portfolioActions'
import { getStockCandles, getUSStockQuote } from '@/shared/api/finnhubApi'
import {
    calculateDailyReturns,
    calculateMean,
    calculateVolatility,
    suggestWeights
} from '@/shared/lib/math/mpt'
import { generateRebalancingGuide, type RebalancingGuide } from '@/shared/lib/math/rebalancingEngine'
import type { ApiResponse } from '@/shared/api'

export interface AssetAnalysis {
    symbol: string
    name: string
    currentWeight: number
    suggestedWeight: number
    volatility: number
    expectedReturn: number
}

export interface PortfolioOptimizationResult {
    assets: AssetAnalysis[]
    overallVolatility: number
    overallExpectedReturn: number
    sharpeRatio: number
    rebalancingGuide?: RebalancingGuide
}

/**
 * 사용자의 현재 포트폴리오를 분석하고 최적 비중 및 리밸런싱 가이드를 제안합니다.
 */
export async function getPortfolioOptimization(): Promise<ApiResponse<PortfolioOptimizationResult>> {
    try {
        // 1. 보유 종목 리스트 조회
        const holdingsResult = await getHoldings()
        if (!holdingsResult.success || !holdingsResult.data || holdingsResult.data.length === 0) {
            return { success: false, error: '분석할 보유 종목이 없습니다.' }
        }

        const holdings = holdingsResult.data

        // 실시간 현재가 수집
        const currentPrices: Record<string, number> = {}
        for (const h of holdings) {
            const priceResult = await getUSStockQuote(h.symbol)
            currentPrices[h.symbol] = priceResult.success ? priceResult.data!.price : h.average_price
        }

        const totalValue = holdings.reduce((sum, h) => sum + (h.quantity * currentPrices[h.symbol]), 0)

        // 2. 과거 데이터 수집 (최근 1년, 일간)
        const to = Math.floor(Date.now() / 1000)
        const from = to - (365 * 24 * 60 * 60)

        const assetAnalyses: AssetAnalysis[] = []

        for (const holding of holdings) {
            const candlesResult = await getStockCandles(holding.symbol, 'D', from, to)

            let volatility = 0
            let expectedReturn = 0

            if (candlesResult.success && candlesResult.data) {
                const prices = candlesResult.data.c
                const returns = calculateDailyReturns(prices)

                // 연환산 (252 영업일 기준)
                volatility = calculateVolatility(returns) * Math.sqrt(252)
                expectedReturn = calculateMean(returns) * 252
            }

            assetAnalyses.push({
                symbol: holding.symbol,
                name: holding.name || holding.symbol,
                currentWeight: totalValue > 0 ? (holding.quantity * currentPrices[holding.symbol]) / totalValue : 0,
                suggestedWeight: 0,
                volatility,
                expectedReturn
            })
        }

        // 3. 최적 비중 계산 (Risk Parity 방식)
        const volatilities = assetAnalyses.map(a => a.volatility)
        const newWeights = suggestWeights(volatilities)
        const suggestedWeightsMap: Record<string, number> = {}

        assetAnalyses.forEach((asset, i) => {
            asset.suggestedWeight = newWeights[i]
            suggestedWeightsMap[asset.symbol] = newWeights[i]
        })

        // 4. 리밸런싱 가이드 생성
        const rebalancingGuide = generateRebalancingGuide(holdings, suggestedWeightsMap, currentPrices)

        // 5. 전체 포트폴리오 지표 산출
        const overallExpectedReturn = assetAnalyses.reduce((sum, a) => sum + (a.expectedReturn * a.suggestedWeight), 0)
        const overallVolatility = assetAnalyses.reduce((sum, a) => sum + (a.volatility * a.suggestedWeight), 0)

        return {
            success: true,
            data: {
                assets: assetAnalyses,
                overallVolatility,
                overallExpectedReturn,
                sharpeRatio: overallVolatility > 0 ? (overallExpectedReturn - 0.03) / overallVolatility : 0,
                rebalancingGuide
            }
        }
    } catch (error) {
        console.error('Portfolio Optimization Error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        }
    }
}
