/**
 * 레이아웃 컴포넌트 (styled-components)
 */

import styled from 'styled-components'

// ========== 인증 페이지 레이아웃 ==========

// 인증 페이지 컨테이너
export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.gradient};
  padding: ${({ theme }) => theme.spacing[4]};
`

// 인증 박스 (폼 래퍼)
export const AuthBox = styled.div`
  width: 100%;
  max-width: 28rem; /* 448px */
`

// ========== 로고 섹션 ==========

export const LogoSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`

export const LogoTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  background: linear-gradient(
    to right, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const LogoSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing[2]};
`

// ========== 대시보드 레이아웃 ==========

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.secondary};
`

export const DashboardHeader = styled.header`
  background: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  position: sticky;
  top: 0;
  z-index: 10;
`

export const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const DashboardMain = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`

// ========== 그리드 레이아웃 ==========

export const Grid = styled.div<{ $cols?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols = 1 }) => $cols}, 1fr);
  gap: ${({ theme, $gap }) => $gap || theme.spacing[6]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

// ========== 플렉스 레이아웃 ==========

export const Flex = styled.div<{
    $direction?: 'row' | 'column';
    $align?: string;
    $justify?: string;
    $gap?: string;
}>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  align-items: ${({ $align = 'stretch' }) => $align};
  justify-content: ${({ $justify = 'flex-start' }) => $justify};
  gap: ${({ theme, $gap }) => $gap || theme.spacing[4]};
`

// ========== 텍스트 링크 ==========

export const TextLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  &:hover {
    text-decoration: underline;
  }
`

export const FooterText = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`
