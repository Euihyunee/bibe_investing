---
description: 작업 시작 전 프로젝트 상태 및 구조 체크리스트 (에이전트용)
---

# 🛫 에이전트 Pre-flight 체크리스트

명령이나 새로운 단계를 수행하기 전에 반드시 다음 사항을 순차적으로 확인하세요.

## 1. 프로젝트 구조 확인
- [ ] `./app`과 `./src/app` 중 메인 페이지 폴더가 어디인지 확인 (`next.config.ts` 참조)
- [ ] 현재 수정하려는 파일이 "Single Source of Truth"인지 재검증 (중복 파일 배제)

## 2. 명명 규칙 및 빌드 환경
- [ ] 생성/수정하려는 파일 및 컴포넌트 명칭이 영문 PascalCase인지 확인
- [ ] 컴포넌트 이름에 한글, 특수문자, 일본어 등이 포함되지 않았는지 확인

## 3. FSD(Feature-Sliced Design) 아키텍처
- [ ] 작업 영역(Shared, Entities, Features, Widgets)이 올바른 레이어인지 확인
- [ ] 새로운 모듈 추가 시 부모 폴더의 `index.ts` (Entry point) 업데이트 계획 수립

## 4. 환경 변수 및 의존성
- [ ] 작업에 필요한 API 키(`.env`)가 설정되어 있는지 확인
- [ ] 환경 변수가 없을 경우를 대비한 런타임 방어 코드(Error Boundary, Mock Fallback) 설계

## 5. 기존 스타일 가이드
- [ ] 프로젝트 내 사용 중인 스타일 도구(Styled-components, Tailwind 등) 확인 및 일관성 유지
- [ ] `.antigravityrules`에 명시된 한국어 주석 및 사고 원칙 준수 여부 점검
