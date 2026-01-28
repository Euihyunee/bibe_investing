---
name: NextJS_AppRouter_Setup
description: Next.js 15+ App Router 환경에서 올바른 페이지 생성 및 라우팅 설정 가이드
---

# Next.js App Router 페이지 생성 및 설정 가이드

이 스킬은 Next.js App Router 프로젝트에서 새로운 페이지를 생성하고 라우팅을 설정할 때 따라야 할 표준 절차와 트러블슈팅 방법을 제공합니다.

## 1. 핵심 규칙 (Critical Rules)

### 1.1 폴더 구조 일관성 유지
- **`app` 폴더의 위치**: 프로젝트 루트에 `app` 폴더가 있거나 `src/app` 폴더가 있어야 합니다. **절대 두 폴더가 동시에 존재해서는 안 됩니다.**
    - ❌ `app/` AND `src/app/` (동시 존재 시 Next.js는 `app/`만 인식하고 `src/app/`은 무시함)
    - ✅ `src/app/` (권장: FSD 아키텍처 등에서 소스 코드 분리 시)
    - ✅ `app/` (루트 레벨 사용 시)

### 1.2 TypeScript 경로 별칭 (Path Aliases)
`src` 디렉토리를 사용하는 경우 `tsconfig.json`에서 경로 별칭을 올바르게 설정해야 합니다.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"] 
    }
  }
}
```
*주의: `["./*"]`로 설정하면 `src` 외부(루트)를 가리키게 되어 `@/shared/...` 등의 import가 실패할 수 있습니다.*

## 2. 페이지 생성 워크플로우

### 단계 1: 라우트 경로 결정
생성하려는 페이지의 URL에 맞춰 폴더를 생성합니다.
- URL: `/auth/login`
- 파일 경로: `src/app/auth/login/page.tsx`

### 단계 2: page.tsx 작성
- 반드시 `default export` 해야 합니다.
- 클라이언트 인터랙션(useState, useEffect 등)이 필요하면 최상단에 `'use client'`를 적시합니다.

```tsx
// src/app/auth/login/page.tsx
'use client' // 필요한 경우

export default function LoginPage() {
  return (
    <div>로그인 페이지</div>
  )
}
```

### 단계 3: 레이아웃 (선택)
해당 경로의 하위 페이지들에 공통 UI를 적용하려면 `layout.tsx`를 생성합니다.
- 경로: `src/app/auth/layout.tsx`

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-container">
      {children}
    </div>
  )
}
```

## 3. 트러블슈팅 (Troubleshooting)

### 상황: 404 Not Found 에러 발생
페이지를 생성했는데도 404가 뜹니다.

**체크리스트:**
1.  **폴더 중복 확인**: 프로젝트 루트에 `app` 폴더와 `src/app` 폴더가 동시에 있는지 확인하세요. 만약 있다면 `src/app`이 무시되고 있을 가능성이 100%입니다.
    - **해결**: `app` 폴더 삭제 또는 `src/app`으로 내용 통합 후 하나만 남기기.
2.  **서버 재시작**: 라우트 구조 변경 후에는 `npm run dev` 프로세스를 완전히 종료하고 다시 시작하세요. 캐싱 문제일 수 있습니다.
3.  **파일 이름 확인**: 파일명이 `page.tsx`인지 확인하세요. (`Page.tsx`, `index.tsx` 등은 라우트로 인식되지 않음)
4.  **exclude 설정**: `tsconfig.json`의 `exclude`에 해당 경로가 포함되어 있는지 확인하세요.

### 상황: Module not found / Import 에러
`@/` 경로로 컴포넌트를 불러오지 못합니다.

**체크리스트:**
1.  **tsconfig.json 확인**: `paths` 설정이 `"@/*": ["./src/*"]`로 되어 있는지 확인하세요.
2.  **IDE 재시작**: VS Code가 `tsconfig.json` 변경 사항을 즉시 반영하지 못할 때가 있습니다. `TypeScript: Restart TS server` 명령을 실행하세요.

## 4. FSD(Feature-Sliced Design) 아키텍처 연동 팁
FSD 구조에서는 `app` 디렉토리를 얇게(Thin) 유지하는 것이 좋습니다. 실제 로직은 `pages` 또는 `widgets` 레이어에 두고, `app` 디렉토리의 `page.tsx`는 이를 조립만 하도록 합니다.

```tsx
// src/app/dashboard/page.tsx
import { DashboardPage } from '@/pages/dashboard'

export default function Page() {
  return <DashboardPage />
}
```
*주의: 개발 초기 단계나 라우팅 디버깅 중에는 `app/page.tsx`에 직접 코드를 작성하여 최소한의 동작을 확인하는 것이 유리합니다.*
