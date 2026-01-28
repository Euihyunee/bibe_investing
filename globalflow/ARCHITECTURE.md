# GlobalFlow - FSD 아키텍처 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

## 📁 디렉토리 구조

```
globalflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 관련 라우트
│   │   ├── (dashboard)/       # 대시보드 라우트
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 홈 페이지
│   │
│   ├── widgets/               # 독립적인 UI 블록
│   │   ├── header/           # 헤더
│   │   ├── sidebar/          # 사이드바
│   │   ├── portfolio-summary/# 포트폴리오 요약
│   │   └── news-feed/        # 뉴스 피드
│   │
│   ├── features/             # 비즈니스 기능
│   │   ├── auth/            # 인증 기능
│   │   ├── portfolio/       # 포트폴리오 관리
│   │   ├── stock-search/    # 종목 검색
│   │   └── ai-recommendations/ # AI 추천
│   │
│   ├── entities/            # 비즈니스 엔티티
│   │   ├── user/           # 사용자
│   │   ├── portfolio/      # 포트폴리오
│   │   ├── stock/          # 주식
│   │   └── news/           # 뉴스
│   │
│   └── shared/             # 공유 코드
│       ├── ui/            # 공통 UI 컴포넌트
│       ├── lib/           # 유틸리티 함수
│       ├── api/           # API 클라이언트
│       ├── config/        # 설정 파일
│       └── types/         # TypeScript 타입
│
├── public/                # 정적 파일
├── .env.local            # 환경 변수
└── package.json          # 의존성
```

## 🎯 FSD 레이어 설명

### 1. **app/** - Application Layer
- Next.js App Router 기반 라우팅
- 페이지 컴포넌트만 포함
- 비즈니스 로직 없음

### 2. **widgets/** - Widget Layer
- 독립적으로 동작하는 UI 블록
- 여러 features를 조합
- 예: Header, Sidebar, PortfolioSummary

### 3. **features/** - Feature Layer
- 사용자 시나리오 기반 기능
- 비즈니스 로직 포함
- 예: Login, AddStock, GetRecommendations

### 4. **entities/** - Entity Layer
- 비즈니스 엔티티
- CRUD 로직
- 예: User, Portfolio, Stock

### 5. **shared/** - Shared Layer
- 재사용 가능한 코드
- 비즈니스 로직 없음
- 예: Button, Input, formatCurrency()

## 📐 의존성 규칙

```
app → widgets → features → entities → shared
```

- **상위 레이어**는 **하위 레이어**만 import 가능
- **같은 레이어** 간 import 금지
- **shared**는 모든 레이어에서 사용 가능

## 🔧 사용 예시

```typescript
// ❌ 잘못된 예: entities가 features를 import
// entities/user/model.ts
import { login } from '@/features/auth'; // 금지!

// ✅ 올바른 예: features가 entities를 import
// features/auth/login.ts
import { User } from '@/entities/user';
import { api } from '@/shared/api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data as User;
};
```

## 📦 각 슬라이스 구조

```
feature/auth/
├── ui/              # UI 컴포넌트
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── model/           # 비즈니스 로직
│   ├── useAuth.ts
│   └── authStore.ts
├── api/             # API 호출
│   └── authApi.ts
└── index.ts         # Public API
```

## 🚀 시작하기

1. 개발 서버 실행:
   ```bash
   npm run dev
   ```

2. 새 기능 추가:
   ```bash
   # features 디렉토리에 새 슬라이스 생성
   mkdir -p src/features/my-feature/{ui,model,api}
   ```

3. 공통 컴포넌트 추가:
   ```bash
   # shared/ui에 컴포넌트 생성
   touch src/shared/ui/MyComponent.tsx
   ```
