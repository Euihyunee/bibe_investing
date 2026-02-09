/**
 * MPT (Modern Portfolio Theory) 관련 수학적 계산 모듈
 */

/**
 * 일간 수익률 계산
 * @param prices 종가 배열
 */
export function calculateDailyReturns(prices: number[]): number[] {
    const returns: number[] = []
    for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
    }
    return returns
}

/**
 * 평균 수익률 계산
 */
export function calculateMean(values: number[]): number {
    if (values.length === 0) return 0
    const sum = values.reduce((acc, val) => acc + val, 0)
    return sum / values.length
}

/**
 * 분산 및 표준편차(변동성) 계산
 */
export function calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0
    const mean = calculateMean(values)
    const squareDiffs = values.map(v => Math.pow(v - mean, 2))
    const avgSquareDiff = calculateMean(squareDiffs)
    return Math.sqrt(avgSquareDiff)
}

/**
 * 공분산 계산
 */
export function calculateCovariance(returns1: number[], returns2: number[]): number {
    if (returns1.length !== returns2.length || returns1.length < 2) return 0
    const mean1 = calculateMean(returns1)
    const mean2 = calculateMean(returns2)

    let sum = 0
    for (let i = 0; i < returns1.length; i++) {
        sum += (returns1[i] - mean1) * (returns2[i] - mean2)
    }
    return sum / (returns1.length - 1)
}

/**
 * 상관계수 계산
 */
export function calculateCorrelation(returns1: number[], returns2: number[]): number {
    const cov = calculateCovariance(returns1, returns2)
    const vol1 = calculateVolatility(returns1)
    const vol2 = calculateVolatility(returns2)

    if (vol1 === 0 || vol2 === 0) return 0
    return cov / (vol1 * vol2)
}

/**
 * 샤프 지수 계산
 * Risk-free rate는 기본적으로 0.03 (3%) 혹은 외부 파라미터로 처리
 */
export function calculateSharpeRatio(expectedReturn: number, volatility: number, riskFreeRate: number = 0.03): number {
    if (volatility === 0) return 0
    return (expectedReturn - riskFreeRate) / volatility
}

/**
 * 간단한 최적 비중 산출 (MVP - Minimum Variance Portfolio 개념 기반)
 * 두 자산간의 비중을 위험도(표준편차)의 역수에 비례하여 분배하는 방식 (Risk Parity 기초)
 * 정식 쿼드라틱 프로그래밍은 서비스 복잡도상 가중치 기반 휴리스틱으로 대체하거나
 * 자산 수가 적을 경우 전수 조사(Brute Force) 최적화를 수행합니다.
 */
export function suggestWeights(volatilities: number[]): number[] {
    // 변동성의 역수 계산 (위험이 낮은 쪽에 더 많은 비중)
    const inverseVols = volatilities.map(v => (v === 0 ? 0 : 1 / v))
    const sumInverseVols = inverseVols.reduce((acc, v) => acc + v, 0)

    if (sumInverseVols === 0) {
        return volatilities.map(() => 1 / volatilities.length)
    }

    return inverseVols.map(v => v / sumInverseVols)
}
