---
description: 작업 완료 시 Notion에 작업 로그를 자동으로 기록합니다
---

# Notion 작업 로그 기록

작업이 완료되면 Notion에 작업 내용을 기록합니다.

## 사전 요구사항

- Notion MCP 서버가 설정되어 있어야 합니다
- 작업 로그를 저장할 Notion 페이지/데이터베이스가 존재해야 합니다

## 워크플로우

### 1. 작업 로그 페이지 검색

먼저 "개발 로그" 또는 "Development Log" 페이지를 검색합니다:

```
mcp_notion-mcp-server_API-post-search
query: "개발 로그" 또는 "Development Log"
```

### 2. 작업 내용 작성

새 페이지를 생성하거나 기존 페이지에 블록을 추가합니다:

#### 새 페이지 생성
```
mcp_notion-mcp-server_API-post-page
parent: { page_id: "상위 페이지 ID" }
properties: {
  title: { type: "title", title: [{ text: { content: "[날짜] 작업명" } }] }
}
```

#### 기존 페이지에 내용 추가
```
mcp_notion-mcp-server_API-patch-block-children
block_id: "페이지 ID"
children: [
  {
    object: "block",
    type: "heading_2",
    heading_2: { rich_text: [{ text: { content: "작업 제목" } }] }
  },
  {
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: [{ text: { content: "작업 내용..." } }] }
  }
]
```

### 3. 작업 로그 포맷

작업 로그에는 다음 내용이 포함됩니다:

| 항목 | 설명 |
|------|------|
| 날짜/시간 | 작업 완료 시점 |
| 작업명 | 수행한 작업의 제목 |
| 변경 파일 | 생성/수정된 파일 목록 |
| 요약 | 작업 내용 요약 |
| 다음 단계 | 후속 작업 계획 |

### 예시 로그 내용

```markdown
## 2026-01-28 미국/한국 주식 시세 API 연동

### 작업 내용
- Finnhub API 클라이언트 구현
- 한국 주식 Mock 데이터 생성
- 대시보드에 실시간 시세 연동

### 변경 파일
- src/shared/api/finnhubApi.ts (NEW)
- src/shared/api/krStockMock.ts (NEW)
- src/features/stock/api/stockActions.ts (NEW)
- app/dashboard/page.tsx (MODIFIED)

### 다음 단계
- 기본 포트폴리오 추적 기능 구현
```

---

## Notion 블록 타입

| 타입 | 용도 |
|------|------|
| heading_1, heading_2, heading_3 | 제목 |
| paragraph | 일반 텍스트 |
| bulleted_list_item | 글머리 기호 목록 |
| numbered_list_item | 번호 목록 |
| code | 코드 블록 |
| to_do | 체크박스 |
| divider | 구분선 |
