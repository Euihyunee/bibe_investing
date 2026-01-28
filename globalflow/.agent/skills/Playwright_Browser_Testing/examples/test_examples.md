# Playwright MCP 테스트 예제

## 예제 1: 로그인 페이지 테스트

### 목표
로그인 페이지가 올바르게 렌더링되고 폼이 동작하는지 확인

### 테스트 순서

```
1. mcp_playwright_browser_navigate
   url: http://localhost:3000/auth/login

2. mcp_playwright_browser_snapshot
   → 결과에서 확인:
   - heading "로그인"
   - textbox "이메일"
   - textbox "비밀번호"
   - button "로그인"
   - link "회원가입"

3. mcp_playwright_browser_fill_form
   fields:
   - { name: "이메일", type: "textbox", ref: "e13", value: "test@example.com" }
   - { name: "비밀번호", type: "textbox", ref: "e16", value: "testpass123" }

4. mcp_playwright_browser_click
   ref: "e17"
   element: "로그인 버튼"

5. mcp_playwright_browser_take_screenshot
   filename: login_test_result.png
```

---

## 예제 2: 대시보드 검증

### 목표
대시보드 페이지의 주요 섹션이 모두 표시되는지 확인

### 테스트 순서

```
1. mcp_playwright_browser_navigate
   url: http://localhost:3000/dashboard

2. mcp_playwright_browser_snapshot
   → 결과에서 확인:
   - heading "GlobalFlow" (헤더)
   - heading "포트폴리오 요약"
   - heading "자산 추이"
   - heading "보유 종목"
   - 시장 데이터 (S&P 500, KOSPI, 브릭스)

3. mcp_playwright_browser_console_messages
   level: "error"
   → 에러 없는지 확인

4. mcp_playwright_browser_take_screenshot
   filename: dashboard_test.png
```

---

## 예제 3: 네비게이션 흐름 테스트

### 목표
로그인 → 회원가입 링크 클릭 → 회원가입 페이지 이동 확인

### 테스트 순서

```
1. mcp_playwright_browser_navigate
   url: http://localhost:3000/auth/login

2. mcp_playwright_browser_snapshot
   → "회원가입" 링크의 ref 확인

3. mcp_playwright_browser_click
   ref: "e19" (회원가입 링크)
   element: "회원가입 링크"

4. mcp_playwright_browser_snapshot
   → 결과에서 확인:
   - Page URL이 /auth/signup인지
   - heading "회원가입" 존재하는지
```

---

## 결과 판정 기준

### ✅ 성공
- 모든 필수 요소가 스냅샷에 존재
- 콘솔에 에러 메시지 없음
- 예상된 URL로 이동함
- 폼 제출 후 올바른 응답

### ❌ 실패
- 필수 요소 누락
- JavaScript 에러 발생
- 404 또는 500 에러
- 예상치 못한 UI 상태
