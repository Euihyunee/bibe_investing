import { Stock, Market } from '@/shared/types'

// 검색을 위한 더미 주식 데이터셋
const MOCK_STOCKS: Stock[] = [
    {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        market: 'US',
        current_price: 185.92,
        change: 1.25,
        change_percentage: 0.68,
        volume: 52000000,
        market_cap: 2800000000000,
        updated_at: new Date()
    },
    {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        market: 'US',
        current_price: 405.21,
        change: -2.34,
        change_percentage: -0.57,
        volume: 21000000,
        market_cap: 3000000000000,
        updated_at: new Date()
    },
    {
        symbol: 'TSLA',
        name: 'Tesla, Inc.',
        market: 'US',
        current_price: 193.57,
        change: 5.12,
        change_percentage: 2.71,
        volume: 85000000,
        market_cap: 600000000000,
        updated_at: new Date()
    },
    {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        market: 'US',
        current_price: 721.33,
        change: 15.42,
        change_percentage: 2.18,
        volume: 42000000,
        market_cap: 1700000000000,
        updated_at: new Date()
    },
    {
        symbol: '005930',
        name: '삼성전자',
        market: 'KR',
        current_price: 160000, // 사용 요청 반영 (테스트용)
        change: 400,
        change_percentage: 0.55,
        volume: 12000000,
        market_cap: 438000000000000,
        updated_at: new Date()
    },
    {
        symbol: '000660',
        name: 'SK하이닉스',
        market: 'KR',
        current_price: 149200,
        change: 2100,
        change_percentage: 1.43,
        volume: 3500000,
        market_cap: 108000000000000,
        updated_at: new Date()
    },
    {
        symbol: '035420',
        name: 'NAVER',
        market: 'KR',
        current_price: 204500,
        change: -1500,
        change_percentage: -0.73,
        volume: 800000,
        market_cap: 33000000000000,
        updated_at: new Date()
    },
    {
        symbol: '035720',
        name: '카카오',
        market: 'KR',
        current_price: 54200,
        change: -200,
        change_percentage: -0.37,
        volume: 1500000,
        market_cap: 24000000000000,
        updated_at: new Date()
    }
]

/**
 * 주식 종목 검색 API
 * @param query 검색어 (이름 또는 심볼)
 * @returns 검색 결과 Stock 배열
 */
export async function searchStocks(query: string): Promise<Stock[]> {
    if (!query || query.trim().length < 2) return []

    const normalizedQuery = query.toLowerCase().trim()

    // 지연 시간을 주어 실제 API 호출 느낌을 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300))

    return MOCK_STOCKS.filter(stock =>
        stock.symbol.toLowerCase().includes(normalizedQuery) ||
        stock.name.toLowerCase().includes(normalizedQuery)
    )
}

/**
 * 특정 종목들의 실시간 시세 및 환율 조회 API
 * @param symbols 주식 심볼 배열
 * @returns 심볼별 현재가 정보를 담은 맵 (USDKRW 포함)
 */
export async function getLatestPrices(symbols: string[]): Promise<Record<string, number>> {
    try {
        // 야후 파이낸스 형식을 위한 심볼 보정
        const adjustedSymbols = symbols.map(s => {
            if (/^\d{6}$/.test(s)) return `${s}.KS`
            return s
        })

        // 보정된 심볼들로 API 호출
        const response = await fetch(`/api/stock/price?symbols=${adjustedSymbols.join(',')}`)

        if (!response.ok) {
            const errorInfo = await response.json().catch(() => ({}))
            const errorMsg = errorInfo.detail?.message || errorInfo.error || '알 수 없는 서버 에러'
            throw new Error(`시세 서버 오류 (${response.status}): ${errorMsg}`)
        }

        const data = await response.json()

        // 서버 응답의 메타데이터 및 가격 정보를 원래 심볼로 매핑
        const finalPrices: Record<string, any> = { ...data }

        // 환율 정보 표준화 (USDKRW=X -> USDKRW)
        if (data['USDKRW=X']) {
            finalPrices['USDKRW'] = data['USDKRW=X']
        }

        symbols.forEach(s => {
            // 한국 종목 심볼 보정 시도 (.KS 또는 .KQ)
            if (/^\d{6}$/.test(s)) {
                if (data[`${s}.KS`] !== undefined) finalPrices[s] = data[`${s}.KS`]
                else if (data[`${s}.KQ`] !== undefined) finalPrices[s] = data[`${s}.KQ`]
            }
        })

        return finalPrices
    } catch (error) {
        console.error('getLatestPrices Error:', error)
        return {}
    }
}
