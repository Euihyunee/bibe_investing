/**
 * Finnhub API 클라이언트 (미국 주식)
 * https://finnhub.io/docs/api
 */

import type {
    StockQuote,
    MarketIndex,
    StockSearchResult,
    ApiResponse,
    NewsArticle,
    NewsSentiment,
    StockCandles
} from './types'

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'

/**
 * Finnhub API 키 가져오기
 * 서버 사이드에서만 호출되어야 함
 */
function getApiKey(): string {
    const apiKey = process.env.FINNHUB_API_KEY
    if (!apiKey) {
        console.warn('FINNHUB_API_KEY가 설정되지 않았습니다. Mock 데이터를 사용합니다.')
        return ''
    }
    return apiKey
}

/**
 * Finnhub API 호출 헬퍼
 */
async function finnhubFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const apiKey = getApiKey()

    // API 키가 없으면 에러
    if (!apiKey) {
        throw new Error('FINNHUB_API_KEY is not configured')
    }

    const url = new URL(`${FINNHUB_BASE_URL}${endpoint}`)
    url.searchParams.set('token', apiKey)

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value)
    }

    const response = await fetch(url.toString(), {
        next: { revalidate: 60 }, // 60초 캐시
    })

    if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`)
    }

    return response.json()
}

/**
 * 미국 주식 시세 조회
 * @param symbol 종목 코드 (예: AAPL, MSFT)
 */
export async function getUSStockQuote(symbol: string): Promise<ApiResponse<StockQuote>> {
    try {
        // Finnhub quote 응답 타입
        interface FinnhubQuote {
            c: number   // 현재가
            d: number   // 변동액
            dp: number  // 변동률
            h: number   // 고가
            l: number   // 저가
            o: number   // 시가
            pc: number  // 전일 종가
            t: number   // 타임스탬프
        }

        const quote = await finnhubFetch<FinnhubQuote>('/quote', { symbol: symbol.toUpperCase() })

        // 유효한 데이터인지 확인
        if (!quote.c || quote.c === 0) {
            return { success: false, error: `종목을 찾을 수 없습니다: ${symbol}` }
        }

        return {
            success: true,
            data: {
                symbol: symbol.toUpperCase(),
                name: symbol.toUpperCase(), // 이름은 별도 API 호출 필요
                market: 'US',
                price: quote.c,
                previousClose: quote.pc,
                change: quote.d,
                changePercent: quote.dp,
                high: quote.h,
                low: quote.l,
                open: quote.o,
                volume: 0, // quote API에서는 제공하지 않음
                timestamp: quote.t * 1000,
            },
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 미국 주식 검색
 * @param query 검색어
 */
export async function searchUSStocks(query: string): Promise<ApiResponse<StockSearchResult[]>> {
    try {
        interface FinnhubSearchResult {
            result: Array<{
                description: string
                displaySymbol: string
                symbol: string
                type: string
            }>
        }

        const data = await finnhubFetch<FinnhubSearchResult>('/search', { q: query })

        const results: StockSearchResult[] = data.result
            .filter(item => item.type === 'Common Stock')
            .slice(0, 10)
            .map(item => ({
                symbol: item.symbol,
                name: item.description,
                type: item.type,
                market: 'US' as const,
            }))

        return { success: true, data: results }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 미국 주요 지수 조회 (S&P 500, DOW, NASDAQ)
 */
export async function getUSMarketIndices(): Promise<ApiResponse<MarketIndex[]>> {
    try {
        // 주요 ETF를 지수 대용으로 사용
        const symbols = [
            { symbol: 'SPY', name: 'S&P 500' },
            { symbol: 'DIA', name: 'Dow Jones' },
            { symbol: 'QQQ', name: 'NASDAQ 100' },
        ]

        const indices: MarketIndex[] = await Promise.all(
            symbols.map(async ({ symbol, name }) => {
                const result = await getUSStockQuote(symbol)
                if (result.success && result.data) {
                    return {
                        symbol,
                        name,
                        value: result.data.price,
                        change: result.data.change,
                        changePercent: result.data.changePercent,
                        market: 'US' as const,
                    }
                }
                // 실패 시 기본값
                return {
                    symbol,
                    name,
                    value: 0,
                    change: 0,
                    changePercent: 0,
                    market: 'US' as const,
                }
            })
        )

        return { success: true, data: indices }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 회사 프로필 조회
 * @param symbol 종목 코드
 */
export async function getCompanyProfile(symbol: string): Promise<ApiResponse<{ name: string; logo: string }>> {
    try {
        interface FinnhubProfile {
            name: string
            logo: string
            ticker: string
            country: string
            exchange: string
        }

        const profile = await finnhubFetch<FinnhubProfile>('/stock/profile2', { symbol: symbol.toUpperCase() })

        return {
            success: true,
            data: {
                name: profile.name || symbol,
                logo: profile.logo || '',
            },
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 시장 뉴스 조회 (일반)
 * @param category 뉴스 카테고리 (general, forex, crypto, merger)
 */
export async function getMarketNews(category: 'general' | 'forex' | 'crypto' | 'merger' = 'general'): Promise<ApiResponse<NewsArticle[]>> {
    try {
        const news = await finnhubFetch<NewsArticle[]>('/news', { category })
        return { success: true, data: news.slice(0, 10) }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 특정 종목 관련 뉴스 조회
 * @param symbol 종목 코드
 * @param from 시작 날짜 (YYYY-MM-DD)
 * @param to 종료 날짜 (YYYY-MM-DD)
 */
export async function getCompanyNews(
    symbol: string,
    from: string,
    to: string
): Promise<ApiResponse<NewsArticle[]>> {
    try {
        const news = await finnhubFetch<NewsArticle[]>('/company-news', {
            symbol: symbol.toUpperCase(),
            from,
            to
        })
        return { success: true, data: news.slice(0, 5) }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 종목 감성 분석 정보 조회
 * @param symbol 종목 코드
 */
export async function getNewsSentiment(symbol: string): Promise<ApiResponse<NewsSentiment>> {
    try {
        interface FinnhubSentiment {
            buzz: {
                articlesInLastWeek: number
                buzz: number
                weeklyAverage: number
            }
            companyNewsScore: number
            sectorAverageBullishPercent: number
            sectorAverageNewsScore: number
            sentiment: {
                bearishPercent: number
                bullishPercent: number
            }
            symbol: string
        }

        const data = await finnhubFetch<FinnhubSentiment>('/news-sentiment', { symbol: symbol.toUpperCase() })

        return {
            success: true,
            data: {
                symbol: data.symbol,
                sentiment: {
                    bullishPercent: data.sentiment.bullishPercent,
                    bearishPercent: data.sentiment.bearishPercent,
                },
                buzz: data.buzz
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}

/**
 * 주식 캔들 데이터(시세) 조회
 * @param symbol 종목 코드
 * @param resolution 데이터 시간 단위 (1, 5, 15, 30, 60, D, W, M)
 * @param from 시작 시점 (UNIX timestamp)
 * @param to 종료 시점 (UNIX timestamp)
 */
export async function getStockCandles(
    symbol: string,
    resolution: string = 'D',
    from: number,
    to: number
): Promise<ApiResponse<StockCandles>> {
    try {
        const data = await finnhubFetch<StockCandles>('/stock/candle', {
            symbol: symbol.toUpperCase(),
            resolution,
            from: from.toString(),
            to: to.toString()
        })

        if (data.s !== 'ok') {
            return { success: false, error: `데이터를 가져올 수 없습니다: ${data.s}` }
        }

        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류'
        }
    }
}
