/**
 * 포트폴리오 관련 타입 정의
 */

/** 보유 종목 */
export interface Holding {
    id: string
    portfolio_id: string
    symbol: string
    name: string | null
    market: 'US' | 'KR' | 'BRICS'
    quantity: number
    average_price: number
    created_at: string
    updated_at: string
}

/** 포트폴리오 */
export interface Portfolio {
    id: string
    user_id: string
    total_value: number
    holdings?: Holding[]
    created_at: string
    updated_at: string
}

/** 보유 종목 생성 요청 */
export interface CreateHoldingRequest {
    symbol: string
    name: string
    market: 'US' | 'KR'
    quantity: number
    average_price: number
}

/** 보유 종목 수정 요청 */
export interface UpdateHoldingRequest {
    quantity?: number
    average_price?: number
}

/** API 응답 */
export interface PortfolioApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}
