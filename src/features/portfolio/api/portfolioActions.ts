/**
 * 포트폴리오 Server Actions
 * PostgreSQL을 통한 포트폴리오 및 보유 종목 CRUD
 */

'use server'

import { query } from '@/shared/api/db'
import { getCurrentUser } from '@/entities/user/api/authApi'
import type {
    Portfolio,
    Holding,
    CreateHoldingRequest,
    UpdateHoldingRequest,
    PortfolioApiResponse
} from '../types'

/**
 * 현재 사용자의 포트폴리오 조회
 * 포트폴리오가 없으면 자동 생성
 */
export async function getOrCreatePortfolio(): Promise<PortfolioApiResponse<Portfolio>> {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { success: false, error: '로그인이 필요합니다' }
        }

        // 기존 포트폴리오 조회
        const result = await query(
            'SELECT * FROM portfolios WHERE user_id = $1',
            [user.id]
        )

        if (result.rows.length > 0) {
            return { success: true, data: result.rows[0] }
        }

        // 포트폴리오가 없으면 생성
        const insertResult = await query(
            'INSERT INTO portfolios (user_id, total_value) VALUES ($1, $2) RETURNING *',
            [user.id, 0]
        )

        return { success: true, data: insertResult.rows[0] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 보유 종목 목록 조회
 */
export async function getHoldings(): Promise<PortfolioApiResponse<Holding[]>> {
    try {
        const portfolioResult = await getOrCreatePortfolio()
        if (!portfolioResult.success || !portfolioResult.data) {
            return { success: false, error: portfolioResult.error }
        }

        const result = await query(
            'SELECT * FROM holdings WHERE portfolio_id = $1 ORDER BY created_at DESC',
            [portfolioResult.data.id]
        )

        return { success: true, data: result.rows || [] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 보유 종목 추가
 */
export async function addHolding(
    request: CreateHoldingRequest
): Promise<PortfolioApiResponse<Holding>> {
    try {
        const portfolioResult = await getOrCreatePortfolio()
        if (!portfolioResult.success || !portfolioResult.data) {
            return { success: false, error: portfolioResult.error }
        }

        const portfolioId = portfolioResult.data.id

        // 이미 보유 중인 종목인지 확인
        const existingResult = await query(
            'SELECT * FROM holdings WHERE portfolio_id = $1 AND symbol = $2',
            [portfolioId, request.symbol]
        )

        const existing = existingResult.rows[0]

        if (existing) {
            const totalQuantity = Number(existing.quantity) + request.quantity
            const totalCost =
                Number(existing.quantity) * Number(existing.average_price) +
                request.quantity * request.average_price
            const newAveragePrice = totalCost / totalQuantity

            const updateResult = await query(
                'UPDATE holdings SET quantity = $1, average_price = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
                [totalQuantity, newAveragePrice, existing.id]
            )

            return { success: true, data: updateResult.rows[0] }
        }

        // 새 종목 추가
        const insertResult = await query(
            `INSERT INTO holdings (portfolio_id, symbol, name, market, quantity, average_price)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [portfolioId, request.symbol, request.name, request.market, request.quantity, request.average_price]
        )

        return { success: true, data: insertResult.rows[0] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 보유 종목 수정
 */
export async function updateHolding(
    holdingId: string,
    request: UpdateHoldingRequest
): Promise<PortfolioApiResponse<Holding>> {
    try {
        const fields = Object.keys(request)
        const values = Object.values(request)
        
        if (fields.length === 0) {
            return { success: false, error: '수정할 데이터가 없습니다' }
        }

        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ')
        const result = await query(
            `UPDATE holdings SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
            [holdingId, ...values]
        )

        if (result.rows.length === 0) {
            return { success: false, error: '종목을 찾을 수 없습니다' }
        }

        return { success: true, data: result.rows[0] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 보유 종목 삭제
 */
export async function deleteHolding(
    holdingId: string
): Promise<PortfolioApiResponse<void>> {
    try {
        await query('DELETE FROM holdings WHERE id = $1', [holdingId])
        return { success: true }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 보유 종목 일부 매도
 */
export async function sellHolding(
    holdingId: string,
    quantity: number
): Promise<PortfolioApiResponse<Holding | null>> {
    try {
        const result = await query('SELECT * FROM holdings WHERE id = $1', [holdingId])
        const holding = result.rows[0]

        if (!holding) {
            return { success: false, error: '종목을 찾을 수 없습니다' }
        }

        const currentQuantity = Number(holding.quantity)

        if (quantity > currentQuantity) {
            return { success: false, error: '보유량보다 많이 매도할 수 없습니다' }
        }

        if (quantity === currentQuantity) {
            await deleteHolding(holdingId)
            return { success: true, data: null }
        }

        const newQuantity = currentQuantity - quantity
        const updateResult = await query(
            'UPDATE holdings SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [newQuantity, holdingId]
        )

        return { success: true, data: updateResult.rows[0] }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}
