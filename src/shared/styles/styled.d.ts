/**
 * styled-components 타입 확장
 * 테마 타입을 DefaultTheme에 적용합니다.
 */

import 'styled-components'
import type { Theme } from './theme'

declare module 'styled-components' {
    export interface DefaultTheme extends Theme { }
}
