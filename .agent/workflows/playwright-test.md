---
description: Playwright MCP를 이용한 브라우저 UI 테스트 워크플로우
---

# Playwright MCP 브라우저 테스트

이 워크플로우는 Playwright MCP 서버를 사용하여 웹 애플리케이션의 UI를 테스트합니다.

## 사전 요구사항

- 개발 서버가 실행 중이어야 합니다 (`npm run dev`)
- Playwright MCP 서버가 설정되어 있어야 합니다

## 테스트 단계

### 1. 개발 서버 상태 확인

먼저 개발 서버가 실행 중인지 확인합니다. 실행 중이 아니면 시작합니다.

```bash
npm run dev
```

### 2. 페이지 접속 및 스냅샷

`mcp_playwright_browser_navigate` 도구로 테스트할 페이지에 접속합니다:

```
URL: http://localhost:3000/{경로}
```

접속 후 `mcp_playwright_browser_snapshot` 도구로 페이지 구조를 확인합니다.

### 3. UI 요소 검증

스냅샷 결과에서 다음을 확인합니다:
- 필수 요소들이 존재하는지 (heading, button, input 등)
- 텍스트 콘텐츠가 올바른지
- 링크가 올바른 URL을 가리키는지

### 4. 인터랙션 테스트

필요시 다음 도구들로 인터랙션을 테스트합니다:

| 도구 | 용도 |
|------|------|
| `mcp_playwright_browser_click` | 버튼, 링크 클릭 |
| `mcp_playwright_browser_type` | 입력 필드에 텍스트 입력 |
| `mcp_playwright_browser_fill_form` | 폼 필드 일괄 입력 |
| `mcp_playwright_browser_select_option` | 드롭다운 선택 |

### 5. 스크린샷 캡처

`mcp_playwright_browser_take_screenshot` 도구로 결과를 캡처합니다:

```
filename: test_screenshot.png
type: png
```

**주의**: 파일명은 상대 경로로 지정해야 합니다 (`.playwright-mcp/` 디렉토리에 저장됨)

### 6. 결과 확인

스크린샷과 스냅샷을 확인하여 테스트 결과를 판단합니다.

---

## 예시: 로그인 페이지 테스트

```yaml
1. 페이지 접속:
   - mcp_playwright_browser_navigate: http://localhost:3000/auth/login

2. 구조 확인:
   - mcp_playwright_browser_snapshot
   - 확인: heading "로그인", textbox "이메일", textbox "비밀번호", button "로그인"

3. 폼 입력 테스트:
   - mcp_playwright_browser_type: ref=e13, text="test@email.com"
   - mcp_playwright_browser_type: ref=e16, text="password123"

4. 제출 테스트:
   - mcp_playwright_browser_click: ref=e17

5. 결과 캡처:
   - mcp_playwright_browser_take_screenshot: login_test.png
```

---

## 유용한 도구 목록

| 도구 | 설명 |
|------|------|
| `mcp_playwright_browser_navigate` | URL로 이동 |
| `mcp_playwright_browser_snapshot` | 페이지 구조 스냅샷 (추천) |
| `mcp_playwright_browser_take_screenshot` | 스크린샷 캡처 |
| `mcp_playwright_browser_click` | 요소 클릭 |
| `mcp_playwright_browser_type` | 텍스트 입력 |
| `mcp_playwright_browser_fill_form` | 폼 일괄 입력 |
| `mcp_playwright_browser_wait_for` | 텍스트 대기 |
| `mcp_playwright_browser_console_messages` | 콘솔 로그 확인 |
| `mcp_playwright_browser_network_requests` | 네트워크 요청 확인 |
| `mcp_playwright_browser_close` | 브라우저 닫기 |

---

## 팁

1. **스냅샷 우선**: 스크린샷보다 스냅샷이 더 정확한 정보를 제공합니다
2. **ref 사용**: 요소와 상호작용할 때 스냅샷에서 얻은 `ref` 값을 사용합니다
3. **대기 시간**: 페이지 로딩이 필요하면 `mcp_playwright_browser_wait_for` 사용
4. **에러 확인**: `mcp_playwright_browser_console_messages`로 콘솔 에러 확인
