import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 * clsx와 tailwind-merge를 조합하여 조건부 클래스와 중복 클래스를 처리합니다.
 * 
 * @example
 * cn("px-2 py-1", condition && "bg-blue-500", "px-4") // "py-1 bg-blue-500 px-4"
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * 숫자를 통화 형식으로 포맷팅
 * @param value - 포맷팅할 숫자
 * @param currency - 통화 코드 (기본값: KRW)
 * @example
 * formatCurrency(1234567) // "₩1,234,567"
 * formatCurrency(1234.56, "USD") // "$1,234.56"
 */
export function formatCurrency(value: number, currency: string = "KRW"): string {
    return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency,
    }).format(value)
}

/**
 * 퍼센트를 포맷팅
 * @param value - 포맷팅할 숫자 (0.1234 = 12.34%)
 * @param decimals - 소수점 자릿수 (기본값: 2)
 * @example
 * formatPercent(0.1234) // "+12.34%"
 * formatPercent(-0.05) // "-5.00%"
 */
export function formatPercent(value: number, decimals: number = 2): string {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${(value * 100).toFixed(decimals)}%`
}

/**
 * 날짜를 포맷팅
 * @param date - 포맷팅할 날짜
 * @param format - 포맷 타입
 * @example
 * formatDate(new Date()) // "2026년 1월 28일"
 * formatDate(new Date(), "short") // "2026.01.28"
 */
export function formatDate(
    date: Date | string,
    format: "long" | "short" | "time" = "long"
): string {
    const d = typeof date === "string" ? new Date(date) : date

    switch (format) {
        case "long":
            return new Intl.DateTimeFormat("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }).format(d)
        case "short":
            return new Intl.DateTimeFormat("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(d)
        case "time":
            return new Intl.DateTimeFormat("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
            }).format(d)
        default:
            return d.toISOString()
    }
}

/**
 * 숫자를 축약 형식으로 포맷팅 (K, M, B)
 * @param value - 포맷팅할 숫자
 * @example
 * formatCompactNumber(1234) // "1.2K"
 * formatCompactNumber(1234567) // "1.2M"
 */
export function formatCompactNumber(value: number): string {
    return new Intl.NumberFormat("ko-KR", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value)
}
