'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchHoldings, addHolding, deleteHolding, HoldingInput } from '@/entities/portfolio/api/portfolioApi'
import { getLatestPrices } from '@/entities/stock/api/stockApi'

export function usePortfolio() {
    const [holdings, setHoldings] = useState<any[]>([])
    const [prices, setPrices] = useState<Record<string, number>>({})
    const [isRealtime, setIsRealtime] = useState(true)
    const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadPortfolio = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await fetchHoldings()
            setHoldings(data || [])

            const symbols = Array.from(new Set((data || []).map((h: any) => h.symbol)))
            const latestPrices = await getLatestPrices(symbols)

            // 메타데이터 추출 및 순수 가격 정보만 저장
            const { _isFallback, _timestamp, ...purePrices } = latestPrices as any
            setPrices(purePrices)
            setIsRealtime(_isFallback === false)
            setLastUpdatedAt(_timestamp || new Date().toISOString())

            setError(null)
        } catch (err: any) {
            setError(err.message || '포트폴리오를 불러오는 중 오류가 발생했습니다.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadPortfolio()

        const interval = setInterval(async () => {
            const symbols = Array.from(new Set(holdings.map((h: any) => h.symbol)))
            if (symbols.length === 0 && Object.keys(prices).length > 0) return

            const latestPrices = await getLatestPrices(symbols)
            const { _isFallback, _timestamp, ...purePrices } = latestPrices as any
            setPrices(purePrices)
            setIsRealtime(_isFallback === false)
            setLastUpdatedAt(_timestamp || new Date().toISOString())
        }, 60000)

        return () => clearInterval(interval)
    }, [loadPortfolio, holdings.length])

    const addItem = async (item: HoldingInput) => {
        try {
            await addHolding(item)
            await loadPortfolio()
            return { success: true }
        } catch (err: any) {
            return { success: false, error: err.message }
        }
    }

    const removeItem = async (id: string) => {
        try {
            await deleteHolding(id)
            await loadPortfolio()
            return { success: true }
        } catch (err: any) {
            return { success: false, error: err.message }
        }
    }

    // 포트폴리오 요약 데이터 계산 (Memoized)
    const { summary, enrichedHoldings } = useMemo(() => {
        let totalInvestedKRW = 0
        let totalValueKRW = 0
        let totalInvestedUSD = 0
        let totalValueUSD = 0
        const exchangeRate = prices['USDKRW'] || prices['USDKRW=X'] || 1350

        const enriched = holdings.map(h => {
            const currentPrice = prices[h.symbol] || h.average_price
            const currency = h.currency || (h.market === 'US' ? 'USD' : 'KRW')

            const invested = Number(h.quantity) * Number(h.average_price)
            const value = Number(h.quantity) * currentPrice

            // 수익금은 해당 통화 기준으로 먼저 계산
            const profit = value - invested

            if (currency === 'USD') {
                totalInvestedUSD += invested
                totalValueUSD += value
            } else {
                totalInvestedKRW += invested
                totalValueKRW += value
            }

            // 개별 종목의 KRW 환산 가치 (UI 표시용)
            const valueKRW = currency === 'USD' ? value * exchangeRate : value

            return {
                ...h,
                currency,
                current_price: currentPrice,
                value: value,
                valueKRW,
                return: profit,
                returnPercentage: invested > 0 ? (profit / invested) * 100 : 0
            }
        })

        // 통합 계산 (KRW 기준)
        // 주의: 현재 방식은 (현재 전체 가치 in KRW) - (전체 투자 원금 in KRW) 이므로 환율 변동 분이 수익률에 포함됨
        const combinedInvested = totalInvestedKRW + (totalInvestedUSD * exchangeRate)
        const combinedValue = totalValueKRW + (totalValueUSD * exchangeRate)
        const totalReturn = combinedValue - combinedInvested
        const returnPercentage = combinedInvested > 0 ? (totalReturn / combinedInvested) * 100 : 0

        return {
            enrichedHoldings: enriched,
            summary: {
                totalValue: combinedValue,
                totalReturn,
                returnPercentage,
                totalUSD: totalValueUSD,
                totalKRW: totalValueKRW,
                exchangeRate,
                isRealtime,
                lastUpdatedAt // 추가
            }
        }
    }, [holdings, prices, isRealtime, lastUpdatedAt])

    return {
        holdings: enrichedHoldings,
        isLoading,
        error,
        summary,
        isRealtime,
        lastUpdatedAt, // 추가
        addItem,
        removeItem,
        refresh: loadPortfolio
    }
}
