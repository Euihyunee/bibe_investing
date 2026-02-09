/**
 * 리밸런싱 알고리즘 엔진
 */

export interface TradeAction {
    symbol: string
    name: string
    action: 'BUY' | 'SELL' | 'HOLD'
    quantity: number
    price: number
    estimatedValue: number
    weightChange: {
        from: number
        to: number
    }
}

export interface RebalancingGuide {
    totalValue: number
    driftScore: number // 전체적 비중 괴리도 (0~100)
    needsRebalancing: boolean
    actions: TradeAction[]
}

/**
 * 리밸런싱 가이드 생성
 * @params currentHoldings 현재 보유 정보 (수량, 평단가 포함)
 * @params suggestedWeights MPT 엔진에서 제안한 목표 비중
 * @params currentPrices 실시간 현재가
 */
export function generateRebalancingGuide(
    holdings: { symbol: string; name: string; quantity: number; average_price: number }[],
    suggestedWeights: Record<string, number>,
    currentPrices: Record<string, number>
): RebalancingGuide {
    const totalValue = holdings.reduce((sum, h) => {
        const price = currentPrices[h.symbol] || h.average_price
        return sum + (h.quantity * price)
    }, 0)

    const actions: TradeAction[] = []
    let totalDrift = 0

    for (const h of holdings) {
        const currentPrice = currentPrices[h.symbol] || h.average_price
        const currentValue = h.quantity * currentPrice
        const currentWeight = totalValue > 0 ? currentValue / totalValue : 0
        const targetWeight = suggestedWeights[h.symbol] || 0

        const targetValue = totalValue * targetWeight
        const valueDiff = targetValue - currentValue
        const quantityDiff = Math.floor(valueDiff / currentPrice)

        totalDrift += Math.abs(targetWeight - currentWeight)

        let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD'
        if (quantityDiff > 0) action = 'BUY'
        else if (quantityDiff < 0) action = 'SELL'

        actions.push({
            symbol: h.symbol,
            name: h.name,
            action,
            quantity: Math.abs(quantityDiff),
            price: currentPrice,
            estimatedValue: Math.abs(quantityDiff * currentPrice),
            weightChange: {
                from: currentWeight,
                to: targetWeight
            }
        })
    }

    // 괴리도 점수 (0~100, 높을수록 리밸런싱 필요)
    // 모든 종목의 비중 차이 합의 절반이 리밸런싱이 필요한 자산의 비율임
    const driftScore = Math.min(100, Math.round((totalDrift / 2) * 500))

    return {
        totalValue,
        driftScore,
        needsRebalancing: driftScore > 10, // 괴리도가 10점 이상이면 추천
        actions: actions.filter(a => a.quantity > 0)
    }
}
