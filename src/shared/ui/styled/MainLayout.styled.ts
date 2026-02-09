import styled from 'styled-components'

/** 전체 앱 감싸는 래퍼 (사이드바 + 콘텐츠) */
export const AppWrapper = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors?.background?.primary || '#f9fafb'};
`

/** 메인 콘텐츠 영역 (사이드바 제외) */
export const MainContent = styled.main`
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; /* flex 자식의 너비 이슈 방지 */
`

/** 대시보드 메인 컨테이너 */
export const DashboardContainer = styled.div`
    padding: 32px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 32px;

    @media (max-width: 768px) {
        padding: 16px;
        gap: 24px;
    }
`

/** 대시보드 헤더 영역 */
export const DashboardHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    h1 {
        font-size: 28px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors?.text?.primary || '#111827'};
    }
`

/** 대시보드 그리드 레이아웃 */
export const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 24px;

    @media (max-width: 1200px) {
        grid-template-columns: 1fr;
    }
`

/** 위젯 섹션 베이스 */
export const WidgetSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

/** 위젯 타이틀 */
export const WidgetTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.text?.primary || '#111827'};
`
