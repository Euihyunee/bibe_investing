/**
 * 포트폴리오 Server Actions
 * Supabase를 통한 포트폴리오 및 보유 종목 CRUD
 */

'use server'

import { createClient } from '@/shared/lib/supabase/server'
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
        const supabase = await createClient()

        // 현재 로그인한 사용자 확인
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return { success: false, error: '로그인이 필요합니다' }
        }

        // 기존 포트폴리오 조회
        const { data: portfolio, error: selectError } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (portfolio) {
            return { success: true, data: portfolio }
        }

        // 포트폴리오가 없으면 생성
        if (selectError?.code === 'PGRST116') { // no rows returned
            const { data: newPortfolio, error: insertError } = await supabase
                .from('portfolios')
                .insert({ user_id: user.id, total_value: 0 })
                .select()
                .single()

            if (insertError) {
                return { success: false, error: insertError.message }
            }

            return { success: true, data: newPortfolio }
        }

        return { success: false, error: selectError?.message || '알 수 없는 오류' }
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
        const supabase = await createClient()

        // 포트폴리오 조회 (없으면 생성)
        const portfolioResult = await getOrCreatePortfolio()
        if (!portfolioResult.success || !portfolioResult.data) {
            return { success: false, error: portfolioResult.error }
        }

        // 보유 종목 조회
        const { data: holdings, error } = await supabase
            .from('holdings')
            .select('*')
            .eq('portfolio_id', portfolioResult.data.id)
            .order('created_at', { ascending: false })

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data: holdings || [] }
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
        const supabase = await createClient()

        // 포트폴리오 조회
        const portfolioResult = await getOrCreatePortfolio()
        if (!portfolioResult.success || !portfolioResult.data) {
            return { success: false, error: portfolioResult.error }
        }

        // 이미 보유 중인 종목인지 확인
        const { data: existing } = await supabase
            .from('holdings')
            .select('*')
            .eq('portfolio_id', portfolioResult.data.id)
            .eq('symbol', request.symbol)
            .single()

        if (existing) {
            // 기존 종목이 있으면 평균 단가 계산 후 업데이트
            const totalQuantity = Number(existing.quantity) + request.quantity
            const totalCost =
                Number(existing.quantity) * Number(existing.average_price) +
                request.quantity * request.average_price
            const newAveragePrice = totalCost / totalQuantity

            const { data: updated, error: updateError } = await supabase
                .from('holdings')
                .update({
                    quantity: totalQuantity,
                    average_price: newAveragePrice
                })
                .eq('id', existing.id)
                .select()
                .single()

            if (updateError) {
                return { success: false, error: updateError.message }
            }

            return { success: true, data: updated }
        }

        // 새 종목 추가
        const { data: newHolding, error: insertError } = await supabase
            .from('holdings')
            .insert({
                portfolio_id: portfolioResult.data.id,
                symbol: request.symbol,
                name: request.name,
                market: request.market,
                quantity: request.quantity,
                average_price: request.average_price,
            })
            .select()
            .single()

        if (insertError) {
            return { success: false, error: insertError.message }
        }

        return { success: true, data: newHolding }
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
        const supabase = await createClient()

        const { data: holding, error } = await supabase
            .from('holdings')
            .update(request)
            .eq('id', holdingId)
            .select()
            .single()

        if (error) {
            return { success: false, error: error.message }
        }

        return { success: true, data: holding }
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
        const supabase = await createClient()

        const { error } = await supabase
            .from('holdings')
            .delete()
            .eq('id', holdingId)

        if (error) {
            return { success: false, error: error.message }
        }

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
        const supabase = await createClient()

        // 현재 보유량 확인
        const { data: holding, error: selectError } = await supabase
            .from('holdings')
            .select('*')
            .eq('id', holdingId)
            .single()

        if (selectError || !holding) {
            return { success: false, error: '종목을 찾을 수 없습니다' }
        }

        const currentQuantity = Number(holding.quantity)

        if (quantity > currentQuantity) {
            return { success: false, error: '보유량보다 많이 매도할 수 없습니다' }
        }

        if (quantity === currentQuantity) {
            // 전량 매도 = 삭제
            await deleteHolding(holdingId)
            return { success: true, data: null }
        }

        // 일부 매도
        const newQuantity = currentQuantity - quantity
        const { data: updated, error: updateError } = await supabase
            .from('holdings')
            .update({ quantity: newQuantity })
            .eq('id', holdingId)
            .select()
            .single()

        if (updateError) {
            return { success: false, error: updateError.message }
        }

        return { success: true, data: updated }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}
