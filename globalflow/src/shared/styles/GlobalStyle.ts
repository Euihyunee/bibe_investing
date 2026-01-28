/**
 * 전역 스타일 정의
 * styled-components의 createGlobalStyle을 사용합니다.
 */

import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* HTML & Body 기본 설정 */
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    font-family: ${({ theme }) => theme.fonts.base};
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.secondary};
    line-height: 1.5;
  }
  
  /* 링크 기본 스타일 */
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  /* 버튼 리셋 */
  button {
    font-family: inherit;
    cursor: pointer;
  }
  
  /* 입력 필드 리셋 */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }
  
  /* 이미지 기본 설정 */
  img {
    max-width: 100%;
    height: auto;
  }
`

export default GlobalStyle
