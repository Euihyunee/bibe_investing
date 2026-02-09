/**
 * 버튼 컴포넌트 (styled-components)
 */

import styled, { css } from 'styled-components'

// 버튼 변형 타입
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
    $variant?: ButtonVariant
    $size?: ButtonSize
    $fullWidth?: boolean
}

// 변형별 스타일
const variantStyles = {
    primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    border: none;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
    secondary: css`
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.primary};
    border: none;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.border};
    }
  `,
    outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.secondary};
    }
  `,
    ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: none;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.background.tertiary};
    }
  `,
}

// 크기별 스타일
const sizeStyles = {
    sm: css`
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
    md: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
    font-size: ${({ theme }) => theme.fontSizes.base};
  `,
    lg: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `,
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  
  /* 크기 */
  ${({ $size = 'md' }) => sizeStyles[$size]}
  
  /* 변형 */
  ${({ $variant = 'primary' }) => variantStyles[$variant]}
  
  /* 전체 너비 */
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
  
  /* 비활성화 */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* 포커스 */
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`
