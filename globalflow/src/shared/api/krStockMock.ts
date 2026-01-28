/**
 * 한국 주식 Mock 데이터
 * 실제 API 연동 전까지 사용할 가상의 시세 데이터
 */

import type { StockQuote, MarketIndex, StockSearchResult, ApiResponse } from './types'

/** 한국 주요 종목 Mock 데이터 */
const MOCK_KR_STOCKS: Record<string, Omit<StockQuote, 'timestamp'>> = {
    '005930': {
        symbol: '005930',
        name: '삼성전자',
        market: 'KR',
        price: 72000,
        previousClose: 71500,
        change: 500,
        changePercent: 0.70,
        high: 72500,
        low: 71200,
        open: 71500,
        volume: 12500000,
    },
    '000660': {
        symbol: '000660',
        name: 'SK하이닉스',
        market: 'KR',
        price: 135000,
        previousClose: 133000,
        change: 2000,
        changePercent: 1.50,
        high: 136000,
        low: 132500,
        open: 133500,
        volume: 3200000,
    },
    '035720': {
        symbol: '035720',
        name: '카카오',
        market: 'KR',
        price: 52000,
        previousClose: 52500,
        change: -500,
        changePercent: -0.95,
        high: 53000,
        low: 51500,
        open: 52500,
        volume: 1800000,
    },
    '035420': {
        symbol: '035420',
        name: 'NAVER',
        market: 'KR',
        price: 215000,
        previousClose: 212000,
        change: 3000,
        changePercent: 1.42,
        high: 217000,
        low: 211500,
        open: 212500,
        volume: 950000,
    },
    '051910': {
        symbol: '051910',
        name: 'LG화학',
        market: 'KR',
        price: 485000,
        previousClose: 492000,
        change: -7000,
        changePercent: -1.42,
        high: 495000,
        low: 482000,
        open: 492000,
        volume: 280000,
    },
    '006400': {
        symbol: '006400',
        name: '삼성SDI',
        market: 'KR',
        price: 425000,
        previousClose: 420000,
        change: 5000,
        changePercent: 1.19,
        high: 428000,
        low: 418000,
        open: 421000,
        volume: 320000,
    },
}

/** KOSPI 지수 Mock */
const MOCK_KOSPI: MarketIndex = {
    symbol: 'KOSPI',
    name: 'KOSPI',
    value: 2567.89,
    change: -12.34,
    changePercent: -0.48,
    market: 'KR',
}

/** KOSDAQ 지수 Mock */
const MOCK_KOSDAQ: MarketIndex = {
    symbol: 'KOSDAQ',
    name: 'KOSDAQ',
    value: 845.67,
    change: 5.23,
    changePercent: 0.62,
    market: 'KR',
}

/**
 * 한국 주식 시세 조회 (Mock)
 * @param symbol 종목 코드 (예: 005930)
 */
export async function getKRStockQuote(symbol: string): Promise<ApiResponse<StockQuote>> {
    // 약간의 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 100))

    const stock = MOCK_KR_STOCKS[symbol]

    if (!stock) {
        return { success: false, error: `종목을 찾을 수 없습니다: ${symbol}` }
    }

    // 랜덤 변동 추가 (실시간 시뮬레이션)
    const randomChange = (Math.random() - 0.5) * 0.01 // -0.5% ~ +0.5%
    const newPrice = Math.round(stock.price * (1 + randomChange))
    const priceChange = newPrice - stock.previousClose

    return {
        success: true,
        data: {
            ...stock,
            price: newPrice,
            change: priceChange,
            changePercent: Number(((priceChange / stock.previousClose) * 100).toFixed(2)),
            timestamp: Date.now(),
        },
    }
}

/**
 * 한국 시장 지수 조회 (Mock)
 */
export async function getKRMarketIndices(): Promise<ApiResponse<MarketIndex[]>> {
    await new Promise(resolve => setTimeout(resolve, 50))

    return {
        success: true,
        data: [MOCK_KOSPI, MOCK_KOSDAQ],
    }
}

/**
 * 한국 주식 검색 (Mock)
 * @param query 검색어 (종목명 또는 코드)
 */
export async function searchKRStocks(query: string): Promise<ApiResponse<StockSearchResult[]>> {
    await new Promise(resolve => setTimeout(resolve, 100))

    const results = Object.values(MOCK_KR_STOCKS)
        .filter(stock =>
            stock.symbol.includes(query) ||
            stock.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(stock => ({
            symbol: stock.symbol,
            name: stock.name,
            type: 'Stock',
            market: 'KR' as const,
        }))

    return { success: true, data: results }
}

/**
 * 모든 한국 Mock 종목 목록
 */
export function getAllKRStocks(): Array<{ symbol: string; name: string }> {
    return Object.values(MOCK_KR_STOCKS).map(s => ({
        symbol: s.symbol,
        name: s.name,
    }))
}
