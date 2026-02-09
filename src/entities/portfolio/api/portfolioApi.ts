import { supabase } from '@/shared/api/supabase'
import { Market } from '@/shared/types'

export interface HoldingInput {
    symbol: string
    name: string
    market: Market
    quantity: number
    average_price: number
    currency: string // 추가: 통화 정보 (KRW, USD 등)
}

/**
 * 사용자의 모든 보유 종목 조회
 */
export async function fetchHoldings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const { data, error } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

/**
 * 새로운 종목 추가
 */
export async function addHolding(holding: HoldingInput) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    const { data, error } = await supabase
        .from('holdings')
        .insert([
            {
                ...holding,
                user_id: user.id
            }
        ])
        .select()

    if (error) throw error
    return data
}

/**
 * 종목 삭제
 */
export async function deleteHolding(id: string) {
    const { error } = await supabase
        .from('holdings')
        .delete()
        .eq('id', id)

    if (error) throw error
}
