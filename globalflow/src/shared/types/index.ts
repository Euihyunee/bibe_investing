/**
 * 사용자 관련 타입 정의
 */

/** 투자 위험 프로필 */
export type RiskProfile = 'conservative' | 'moderate' | 'aggressive'

/** 투자 목표 */
export type InvestmentGoal = 'retirement' | 'short_term' | 'wealth_building'

/** 투자 기간 */
export type InvestmentPeriod = '1year' | '3years' | '5years+'

/** 사용자 인터페이스 */
export interface User {
    id: string
    email: string
    name: string
    created_at: Date
    risk_profile?: RiskProfile
    investment_goal?: InvestmentGoal
    investment_period?: InvestmentPeriod
}

/**
 * 포트폴리오 관련 타입 정의
 */

/** 시장 타입 */
export type Market = 'US' | 'KR' | 'BRICS'

/** 포트폴리오 인터페이스 */
export interface Portfolio {
    id: string
    user_id: string
    total_value: number
    created_at: Date
    updated_at: Date
}

/** 보유 종목 인터페이스 */
export interface Holding {
    id: string
    portfolio_id: string
    symbol: string
    name: string
    market: Market
    quantity: number
    average_price: number
    current_price: number
    total_value: number
    return_amount: number
    return_percentage: number
}

/** 포트폴리오 배분 */
export interface Allocation {
    us: { value: number; percentage: number }
    korea: { value: number; percentage: number }
    brics: { value: number; percentage: number }
}

/**
 * 주식 관련 타입 정의
 */

/** 주식 정보 */
export interface Stock {
    symbol: string
    name: string
    market: Market
    current_price: number
    change: number
    change_percentage: number
    volume: number
    market_cap: number
    updated_at: Date
}

/**
 * 뉴스 관련 타입 정의
 */

/** 뉴스 감성 */
export type NewsSentiment = 'positive' | 'negative' | 'neutral'

/** 뉴스 기사 */
export interface NewsArticle {
    id: string
    title: string
    summary: string
    source: string
    url: string
    published_at: Date
    sentiment: NewsSentiment
    impact_score: number // 0-100
    related_stocks: string[]
    related_sectors: string[]
}

/**
 * AI 추천 관련 타입 정의
 */

/** 추천 타입 */
export type RecommendationType = 'buy' | 'sell' | 'rebalance'

/** 리스크 레벨 */
export type RiskLevel = 'low' | 'medium' | 'high'

/** AI 추천 */
export interface Recommendation {
    id: string
    user_id: string
    type: RecommendationType
    symbol: string
    reason: string
    confidence: number // 0-100
    expected_return: number
    risk_level: RiskLevel
    created_at: Date
    expires_at: Date
}

/**
 * API 응답 타입 정의
 */

/** 포트폴리오 조회 응답 */
export interface PortfolioResponse {
    total_value: number
    total_return: number
    return_percentage: number
    allocations: Allocation
    holdings: Holding[]
}

/** 리밸런싱 제안 */
export interface RebalancingSuggestion {
    should_rebalance: boolean
    reason: string
    current_allocation: Allocation
    target_allocation: Allocation
    trades: Trade[]
}

/** 거래 */
export interface Trade {
    symbol: string
    action: 'buy' | 'sell'
    quantity: number
    estimated_cost: number
}
