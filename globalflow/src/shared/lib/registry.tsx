/**
 * styled-components를 위한 Registry 컴포넌트
 * Next.js App Router에서 SSR 시 스타일을 올바르게 주입합니다.
 */

'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from 'styled-components'
import theme from '@/shared/styles/theme'
import GlobalStyle from '@/shared/styles/GlobalStyle'

export default function StyledComponentsRegistry({
    children,
}: {
    children: React.ReactNode
}) {
    // 서버에서 한 번만 스타일시트 생성
    const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

    useServerInsertedHTML(() => {
        const styles = styledComponentsStyleSheet.getStyleElement()
        styledComponentsStyleSheet.instance.clearTag()
        return <>{styles}</>
    })

    // 클라이언트에서는 ThemeProvider만 사용
    if (typeof window !== 'undefined') {
        return (
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                {children}
            </ThemeProvider>
        )
    }

    // 서버에서는 StyleSheetManager도 사용
    return (
        <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                {children}
            </ThemeProvider>
        </StyleSheetManager>
    )
}
