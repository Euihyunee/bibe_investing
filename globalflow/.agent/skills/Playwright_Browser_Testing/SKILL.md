---
name: Playwright Browser Testing
description: Playwright MCP 서버를 활용한 브라우저 UI 테스트 및 자동화 가이드
---

# Playwright Browser Testing Skill

## 개요

이 스킬은 Playwright MCP 서버를 사용하여 웹 애플리케이션의 브라우저 테스트를 수행하는 방법을 설명합니다.

---

## 핵심 도구

### 1. 네비게이션

```typescript
// 페이지로 이동
mcp_playwright_browser_navigate({ url: "http://localhost:3000/path" })

// 뒤로 가기
mcp_playwright_browser_navigate_back()
```

### 2. 페이지 분석 (가장 중요!)

```typescript
// 접근성 스냅샷 - 페이지 구조를 YAML로 반환
// 이것이 가장 정확한 페이지 분석 방법!
mcp_playwright_browser_snapshot()

// 스크린샷 캡처
mcp_playwright_browser_take_screenshot({
  filename: "test.png",  // 상대 경로만 사용
  type: "png"
})
```

### 3. 요소 상호작용

```typescript
// 클릭 - ref는 스냅샷에서 얻음
mcp_playwright_browser_click({ ref: "e17", element: "로그인 버튼" })

// 텍스트 입력
mcp_playwright_browser_type({ 
  ref: "e13", 
  text: "test@email.com",
  element: "이메일 입력 필드"
})

// 폼 일괄 입력
mcp_playwright_browser_fill_form({
  fields: [
    { name: "이메일", type: "textbox", ref: "e13", value: "test@email.com" },
    { name: "비밀번호", type: "textbox", ref: "e16", value: "password123" }
  ]
})
```

### 4. 대기 및 검증

```typescript
// 텍스트 나타날 때까지 대기
mcp_playwright_browser_wait_for({ text: "로그인 성공" })

// 텍스트 사라질 때까지 대기
mcp_playwright_browser_wait_for({ textGone: "로딩 중..." })

// 시간 대기 (초)
mcp_playwright_browser_wait_for({ time: 2 })
```

### 5. 디버깅

```typescript
// 콘솔 메시지 확인
mcp_playwright_browser_console_messages({ level: "error" })

// 네트워크 요청 확인
mcp_playwright_browser_network_requests({ includeStatic: false })
```

---

## 테스트 패턴

### 패턴 1: 페이지 렌더링 검증

```
1. mcp_playwright_browser_navigate → 페이지 접속
2. mcp_playwright_browser_snapshot → 구조 확인
3. 스냅샷에서 필수 요소 존재 여부 확인
4. mcp_playwright_browser_take_screenshot → 결과 저장
```

### 패턴 2: 폼 제출 테스트

```
1. mcp_playwright_browser_navigate → 폼 페이지 접속
2. mcp_playwright_browser_snapshot → ref 값 확인
3. mcp_playwright_browser_fill_form → 폼 입력
4. mcp_playwright_browser_click → 제출 버튼 클릭
5. mcp_playwright_browser_wait_for → 결과 대기
6. mcp_playwright_browser_snapshot → 결과 확인
```

### 패턴 3: 네비게이션 테스트

```
1. mcp_playwright_browser_navigate → 시작 페이지
2. mcp_playwright_browser_click → 링크 클릭
3. mcp_playwright_browser_snapshot → 이동된 페이지 확인
4. URL 및 콘텐츠 검증
```

---

## 스냅샷 해석

스냅샷 결과 예시:

```yaml
- generic [ref=e1]:
  - heading "로그인" [level=2] [ref=e8]
  - textbox "이메일" [ref=e13]:
    - /placeholder: your@email.com
  - textbox "비밀번호" [ref=e16]
  - button "로그인" [ref=e17] [cursor=pointer]
  - link "회원가입" [ref=e19]:
    - /url: /auth/signup
```

**핵심 정보:**
- `[ref=eXX]`: 요소와 상호작용할 때 사용하는 ID
- `heading`, `button`, `textbox` 등: 요소 타입
- 따옴표 안의 텍스트: 요소의 접근성 이름
- `/placeholder`, `/url`: 추가 속성

---

## 주의사항

1. **스크린샷 경로**: 반드시 상대 경로 사용 (`.playwright-mcp/` 폴더에 저장됨)
2. **ref 값 변동**: 페이지가 변경되면 ref 값도 변경될 수 있음
3. **서버 상태**: 테스트 전 개발 서버가 실행 중인지 확인
4. **비동기 콘텐츠**: 동적 콘텐츠는 `wait_for` 사용

---

## 체크리스트

테스트 수행 시 확인사항:

- [ ] 개발 서버 실행 중 확인
- [ ] 페이지 접속 성공 확인
- [ ] 필수 UI 요소 존재 확인
- [ ] 폼 입력/제출 동작 확인
- [ ] 에러 메시지 없음 확인
- [ ] 콘솔 에러 없음 확인
