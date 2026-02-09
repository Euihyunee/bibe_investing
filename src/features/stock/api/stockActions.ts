/**
 * 주식 관련 Server Actions
 * Next.js Server Actions를 사용하여 API 호출을 서버에서 처리
 */

'use server'

import {
    getUSStockQuote,
    getUSMarketIndices,
    searchUSStocks,
    getKRStockQuote,
    getKRMarketIndices,
    searchKRStocks,
} from '@/shared/api'
import type { StockQuote, MarketIndex, StockSearchResult, ApiResponse, StockMarket } from '@/shared/api'

/**
 * 통합 주식 시세 조회
 * @param symbol 종목 코드
 * @param market 시장 (US/KR)
 */
export async function getStockQuote(
    symbol: string,
    market: StockMarket
): Promise<ApiResponse<StockQuote>> {
    if (market === 'US') {
        return getUSStockQuote(symbol)
    } else {
        return getKRStockQuote(symbol)
    }
}

/**
 * 통합 시장 지수 조회
 */
export async function getAllMarketIndices(): Promise<{
    us: MarketIndex[]
    kr: MarketIndex[]
}> {
    const [usResult, krResult] = await Promise.all([
        getUSMarketIndices(),
        getKRMarketIndices(),
    ])

    return {
        us: usResult.success ? usResult.data || [] : [],
        kr: krResult.success ? krResult.data || [] : [],
    }
}

/**
 * 통합 주식 검색
 * @param query 검색어
 * @param market 시장 (선택, 없으면 모든 시장)
 */
export async function searchStocks(
    query: string,
    market?: StockMarket
): Promise<ApiResponse<StockSearchResult[]>> {
    if (market === 'US') {
        return searchUSStocks(query)
    } else if (market === 'KR') {
        return searchKRStocks(query)
    }

    // 모든 시장 검색
    const [usResult, krResult] = await Promise.all([
        searchUSStocks(query),
        searchKRStocks(query),
    ])

    const combined: StockSearchResult[] = [
        ...(usResult.success ? usResult.data || [] : []),
        ...(krResult.success ? krResult.data || [] : []),
    ]

    return { success: true, data: combined }
}

/**
 * 여러 종목 일괄 시세 조회
 * @param symbols 종목 목록 [{symbol, market}]
 */
export async function getMultipleQuotes(
    symbols: Array<{ symbol: string; market: StockMarket }>
): Promise<ApiResponse<StockQuote[]>> {
    const results = await Promise.all(
        symbols.map(({ symbol, market }) => getStockQuote(symbol, market))
    )

    const quotes = results
        .filter(r => r.success && r.data)
        .map(r => r.data as StockQuote)

    return { success: true, data: quotes }
}
