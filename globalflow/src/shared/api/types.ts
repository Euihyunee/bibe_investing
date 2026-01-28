/**
 * 주식 시세 관련 타입 정의
 */

/** 시장 타입 */
export type StockMarket = 'US' | 'KR'

/** 주식 시세 정보 */
export interface StockQuote {
    symbol: string          // 종목 코드
    name: string            // 종목명
    market: StockMarket     // 시장 (US/KR)
    price: number           // 현재가
    previousClose: number   // 전일 종가
    change: number          // 변동액
    changePercent: number   // 변동률 (%)
    high: number            // 고가
    low: number             // 저가
    open: number            // 시가
    volume: number          // 거래량
    timestamp: number       // 타임스탬프
}

/** 시장 지수 정보 */
export interface MarketIndex {
    symbol: string
    name: string
    value: number
    change: number
    changePercent: number
    market: StockMarket
}

/** 검색 결과 */
export interface StockSearchResult {
    symbol: string
    name: string
    type: string
    market: StockMarket
}

/** API 응답 래퍼 */
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

/** 뉴스 기사 정보 */
export interface NewsArticle {
    id: number
    category: string
    datetime: number
    headline: string
    image: string
    related: string
    source: string
    summary: string
    url: string
}

/** 뉴스 감성 분석 결과 */
export interface NewsSentiment {
    symbol: string
    sentiment: {
        bullishPercent: number
        bearishPercent: number
    }
    buzz: {
        articlesInLastWeek: number
        buzz: number
        weeklyAverage: number
    }
}

/** AI 뉴스 요약 결과 */
export interface AIContentSummary {
    summary: string        // 한글 요약
    sentiment: 'positive' | 'negative' | 'neutral' // 감성
    impact_score: number  // 시장 영향도 (1-10)
    keywords: string[]    // 주요 키워드
}

/**
 * 주식 캔들 데이터 (과거 수익률 계산용)
 */
export interface StockCandles {
    c: number[]    // 종가 (Close prices)
    h: number[]    // 고가
    l: number[]    // 저가
    o: number[]    // 시가
    s: string      // 상태 (ok/no_data)
    t: number[]    // 타임스탬프
    v: number[]    // 거래량
}
