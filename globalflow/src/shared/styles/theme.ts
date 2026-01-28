/**
 * GlobalFlow 테마 정의
 * 모든 디자인 토큰을 중앙에서 관리합니다.
 */

const theme = {
    // 색상 팔레트
    colors: {
        // 브랜드 색상
        primary: '#2563eb',      // blue-600
        primaryHover: '#1d4ed8', // blue-700
        secondary: '#7c3aed',    // purple-600

        // 텍스트 색상
        text: {
            primary: '#111827',    // gray-900 (거의 검정)
            secondary: '#374151',  // gray-700
            muted: '#6b7280',      // gray-500
            inverse: '#ffffff',    // 흰색 (어두운 배경용)
        },

        // 배경 색상
        background: {
            primary: '#ffffff',
            secondary: '#f8fafc',  // slate-50
            tertiary: '#f1f5f9',   // slate-100
            gradient: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
        },

        // 테두리
        border: '#d1d5db',       // gray-300
        borderLight: '#e5e7eb',  // gray-200

        // 상태 색상
        success: '#16a34a',      // green-600
        successLight: '#dcfce7', // green-100
        error: '#dc2626',        // red-600
        errorLight: '#fee2e2',   // red-100
        warning: '#d97706',      // amber-600
    },

    // 폰트
    fonts: {
        base: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    },

    // 폰트 크기
    fontSizes: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
    },

    // 폰트 굵기
    fontWeights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },

    // 간격
    spacing: {
        0: '0',
        1: '0.25rem',  // 4px
        2: '0.5rem',   // 8px
        3: '0.75rem',  // 12px
        4: '1rem',     // 16px
        5: '1.25rem',  // 20px
        6: '1.5rem',   // 24px
        8: '2rem',     // 32px
        10: '2.5rem',  // 40px
        12: '3rem',    // 48px
    },

    // 테두리 반경
    borderRadius: {
        sm: '0.25rem',   // 4px
        md: '0.375rem',  // 6px
        lg: '0.5rem',    // 8px
        xl: '0.75rem',   // 12px
        full: '9999px',
    },

    // 그림자
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },

    // 트랜지션
    transitions: {
        fast: '150ms ease',
        normal: '200ms ease',
        slow: '300ms ease',
    },
} as const

export type Theme = typeof theme
export default theme
