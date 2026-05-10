# PromptLab v3 Architecture

## 1. 아키텍처 목표

PromptLab v3는 기존 PromptLab을 수리하는 방식이 아니라, 구조를 다시 잡아 재구축하는 프로젝트입니다.

목표는 다음과 같습니다.

- 기존 로딩 이슈를 분석하지 않고 새 구조로 재구축
- 기존 900여 개 저품질 프롬프트를 핵심 데이터로 유지하지 않음
- PromptLab을 메인 브랜드로 통합
- AI SafeCheck를 PromptLab 내부 안전 검사 모듈로 통합
- Supabase Auth, Database, CRUD, BaaS를 실제 기능으로 반영
- 화면, 컴포넌트, 비즈니스 로직, DB 접근, 검증, 테스트를 분리
- 오류 발생 시 원인을 빠르게 찾을 수 있는 구조로 구현
- 모든 구현은 무료 플랜 기준으로 진행

## 2. 최종 서비스 구조

PromptLab은 프롬프트를 만들고, 저장하고, 검증하고, 안전하게 활용하는 플랫폼입니다.

AI SafeCheck는 PromptLab 안에서 프롬프트 저장 전 위험 요소를 검사하는 안전 검사 모듈입니다.

최종 흐름은 다음과 같습니다.

1. 사용자가 로그인합니다.
2. 프롬프트를 작성합니다.
3. 저장 전 AI SafeCheck 검사를 실행합니다.
4. 개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 검사합니다.
5. 위험 점수와 판정을 확인합니다.
6. 안전 문장 제안을 확인합니다.
7. 수정된 프롬프트를 저장합니다.
8. 저장된 프롬프트를 목록과 상세 화면에서 다시 확인합니다.

## 3. 브랜드 구조

서비스명은 PromptLab입니다.

AI SafeCheck는 독립 브랜드가 아니라 PromptLab 내부 기능 모듈로 둡니다.

브랜드 구조는 다음과 같습니다.

- PromptLab: 프롬프트 생성, 저장, 관리, 재사용 플랫폼
- AI SafeCheck: 프롬프트 저장 전 안전 검사 모듈

운영 도메인은 다음 주소를 유지합니다.

https://promptlab.io.kr

## 4. 무료 플랜 기준

모든 구현은 무료 플랜 기준으로 진행합니다.

사용하는 무료 도구는 다음과 같습니다.

- GitHub Free
- Vercel Hobby
- Supabase Free

사용하지 않는 기능은 다음과 같습니다.

- Supabase Pro
- Vercel Pro
- Log Drains
- 대용량 Storage
- 유료 외부 LLM API 필수 의존
- PDF 업로드 분석
- HWP 업로드 분석
- OCR
- 기업 SSO
- 결제 기능

## 5. 보안 원칙

PromptLab v3는 프롬프트를 저장하는 플랫폼이지만, 민감정보 원문을 무분별하게 저장하지 않습니다.

AI SafeCheck 검사 결과를 저장할 때도 원문 중심이 아니라 메타데이터 중심으로 저장합니다.

저장하지 않을 데이터는 다음과 같습니다.

- 검사 원문 속 고객명 원문
- 전화번호 원문
- 진료기록 원문
- 상담기록 원문
- 회사기밀 원문
- 계약정보 원문
- 민감정보 원문
- service_role key

저장 가능한 데이터는 다음과 같습니다.

- 프롬프트 제목
- 프롬프트 본문
- 카테고리
- 사용 목적
- 변수
- 예시 입력
- 예시 출력
- 공개 여부
- AI SafeCheck 위험 점수
- AI SafeCheck 판정
- 위험 카테고리
- 안전 문장
- 정책 버전
- 탐지기 버전
- 생성일
- 수정일
- 사용자 ID

service_role key는 클라이언트 코드, GitHub, Vercel 공개 환경, README에 절대 넣지 않습니다.

## 6. 인증 구조

Supabase Auth를 사용합니다.

무한로딩을 줄이기 위해 전체 middleware 보호 방식은 처음부터 사용하지 않습니다.

인증 구조는 다음과 같습니다.

- /login: 공개
- /auth/callback: 공개
- /: 공개
- /prompts: 일부 공개 가능
- /dashboard: 보호
- /write: 보호
- /admin: 보호
- /reports: 보호

보호 페이지는 서버에서 세션을 확인합니다.

세션이 없으면 /login으로 한 번만 redirect합니다.

클라이언트 useEffect에서 로그인 상태 확인 후 router.push를 반복하는 구조는 사용하지 않습니다.

환경변수가 없으면 로딩 화면을 계속 보여주지 않고 설정 오류 메시지를 표시합니다.

저장 실패 시 자동 재시도 루프를 만들지 않습니다.

## 7. Supabase 구조

Supabase는 PromptLab v3의 Auth, Database, CRUD를 담당합니다.

초기 테이블은 다음과 같습니다.

- promptlab_profiles
- promptlab_categories
- promptlab_prompts
- promptlab_safecheck_policies
- promptlab_safecheck_reports

### promptlab_profiles

사용자 프로필 정보를 저장합니다.

예상 컬럼은 다음과 같습니다.

- id
- user_id
- display_name
- role
- created_at
- updated_at

### promptlab_categories

프롬프트 카테고리를 저장합니다.

예상 컬럼은 다음과 같습니다.

- id
- name
- slug
- description
- sort_order
- created_at
- updated_at

### promptlab_prompts

프롬프트 본문과 메타데이터를 저장합니다.

예상 컬럼은 다음과 같습니다.

- id
- user_id
- category_id
- title
- use_case
- prompt_body
- variables
- example_input
- example_output
- safety_notes
- visibility
- status
- created_at
- updated_at

### promptlab_safecheck_policies

사용자별 또는 조직별 금지어와 정책을 저장합니다.

예상 컬럼은 다음과 같습니다.

- id
- user_id
- policy_name
- sensitive_keywords
- block_original_storage
- enable_llm_rewrite
- created_at
- updated_at

### promptlab_safecheck_reports

AI SafeCheck 검사 결과 메타데이터를 저장합니다.

예상 컬럼은 다음과 같습니다.

- id
- user_id
- prompt_id
- score
- level
- risk_categories
- safe_prompt
- policy_version
- detector_version
- created_at

## 8. RLS 원칙

Supabase RLS를 활성화합니다.

기본 원칙은 다음과 같습니다.

- 사용자는 자신의 프로필만 조회하고 수정할 수 있습니다.
- 사용자는 자신의 비공개 프롬프트만 수정하고 삭제할 수 있습니다.
- 공개 프롬프트는 조회만 허용할 수 있습니다.
- 사용자는 자신의 SafeCheck 정책만 조회하고 수정할 수 있습니다.
- 사용자는 자신의 SafeCheck 리포트만 조회할 수 있습니다.
- 관리 기능은 MVP 단계에서는 개인 계정 기준으로 제한합니다.

초기 MVP에서는 복잡한 조직 권한은 만들지 않습니다.

## 9. 최종 폴더 구조

예상 최종 구조는 다음과 같습니다.

    promptlab/
    ├─ app/
    │  ├─ layout.tsx
    │  ├─ page.tsx
    │  ├─ globals.css
    │  │
    │  ├─ _components/
    │  │  ├─ AppHeader.tsx
    │  │  ├─ AppLogo.tsx
    │  │  ├─ AppNavigation.tsx
    │  │  ├─ UserMenu.client.tsx
    │  │  └─ AuthStatus.tsx
    │  │
    │  ├─ login/
    │  │  ├─ page.tsx
    │  │  └─ _components/
    │  │     └─ LoginForm.client.tsx
    │  │
    │  ├─ auth/
    │  │  └─ callback/
    │  │     └─ route.ts
    │  │
    │  ├─ (marketing)/
    │  │  └─ page.tsx
    │  │
    │  ├─ (app)/
    │  │  ├─ prompts/
    │  │  │  ├─ page.tsx
    │  │  │  └─ _components/
    │  │  │     ├─ PromptList.tsx
    │  │  │     ├─ PromptCard.tsx
    │  │  │     ├─ PromptFilters.client.tsx
    │  │  │     ├─ PromptSearch.client.tsx
    │  │  │     └─ PromptCategoryTabs.client.tsx
    │  │  │
    │  │  ├─ prompts/
    │  │  │  └─ [id]/
    │  │  │     ├─ page.tsx
    │  │  │     └─ _components/
    │  │  │        ├─ PromptDetail.tsx
    │  │  │        ├─ PromptMeta.tsx
    │  │  │        └─ PromptSafeCheckSummary.tsx
    │  │  │
    │  │  ├─ write/
    │  │  │  ├─ page.tsx
    │  │  │  └─ _components/
    │  │  │     ├─ PromptEditor.client.tsx
    │  │  │     ├─ PromptForm.client.tsx
    │  │  │     ├─ PromptMetadataForm.client.tsx
    │  │  │     ├─ SafeCheckPanel.tsx
    │  │  │     └─ SavePromptButton.client.tsx
    │  │  │
    │  │  ├─ dashboard/
    │  │  │  ├─ page.tsx
    │  │  │  └─ _components/
    │  │  │     ├─ DashboardShell.tsx
    │  │  │     ├─ MyPromptList.tsx
    │  │  │     └─ DashboardStats.tsx
    │  │  │
    │  │  ├─ safecheck/
    │  │  │  ├─ page.tsx
    │  │  │  └─ _components/
    │  │  │     ├─ SafeCheckShell.tsx
    │  │  │     ├─ SafeCheckGuideCard.tsx
    │  │  │     ├─ SafeCheckInput.client.tsx
    │  │  │     ├─ SafeCheckResult.tsx
    │  │  │     ├─ RiskDecisionBanner.tsx
    │  │  │     ├─ RiskScoreCard.tsx
    │  │  │     ├─ RiskEvidenceList.tsx
    │  │  │     ├─ SafePromptPreview.tsx
    │  │  │     └─ ConsistencyMeta.tsx
    │  │  │
    │  │  ├─ admin/
    │  │  │  ├─ page.tsx
    │  │  │  └─ _components/
    │  │  │     ├─ AdminShell.tsx
    │  │  │     ├─ PolicyForm.client.tsx
    │  │  │     ├─ KeywordTable.tsx
    │  │  │     └─ AddKeywordDialog.client.tsx
    │  │  │
    │  │  └─ reports/
    │  │     ├─ page.tsx
    │  │     └─ _components/
    │  │        ├─ ReportList.tsx
    │  │        ├─ ReportFilters.client.tsx
    │  │        └─ ReportPolicyMeta.tsx
    │  │
    │  └─ api/
    │     ├─ prompts/
    │     │  └─ route.ts
    │     ├─ safecheck/
    │     │  └─ route.ts
    │     └─ reports/
    │        └─ route.ts
    │
    ├─ features/
    │  ├─ prompts/
    │  │  ├─ schemas/
    │  │  ├─ types/
    │  │  ├─ server/
    │  │  │  ├─ get-prompts.ts
    │  │  │  ├─ get-prompt.ts
    │  │  │  ├─ create-prompt.ts
    │  │  │  ├─ update-prompt.ts
    │  │  │  └─ delete-prompt.ts
    │  │  └─ constants/
    │  │
    │  ├─ safecheck/
    │  │  ├─ constants/
    │  │  ├─ schemas/
    │  │  ├─ types/
    │  │  ├─ server/
    │  │  │  ├─ detectors/
    │  │  │  ├─ normalize-input.ts
    │  │  │  ├─ merge-risk-findings.ts
    │  │  │  ├─ calculate-risk-score.ts
    │  │  │  ├─ decide-risk-level.ts
    │  │  │  ├─ build-safe-prompt.ts
    │  │  │  └─ scan-text.ts
    │  │  └─ tests/
    │  │
    │  ├─ policy/
    │  │  ├─ schemas/
    │  │  ├─ types/
    │  │  ├─ constants/
    │  │  └─ server/
    │  │     ├─ get-policy.ts
    │  │     └─ save-policy.ts
    │  │
    │  ├─ reports/
    │  │  ├─ schemas/
    │  │  ├─ types/
    │  │  └─ server/
    │  │     ├─ create-report.ts
    │  │     └─ get-reports.ts
    │  │
    │  └─ auth/
    │     ├─ schemas/
    │     ├─ types/
    │     └─ server/
    │
    ├─ shared/
    │  ├─ ui/
    │  │  ├─ button.tsx
    │  │  ├─ card.tsx
    │  │  ├─ input.tsx
    │  │  ├─ textarea.tsx
    │  │  ├─ badge.tsx
    │  │  ├─ dialog.tsx
    │  │  └─ spinner.tsx
    │  └─ lib/
    │     ├─ cn.ts
    │     ├─ date.ts
    │     ├─ invariant.ts
    │     └─ json.ts
    │
    ├─ server/
    │  ├─ db/
    │  │  ├─ supabase-browser.ts
    │  │  └─ supabase-server.ts
    │  ├─ auth/
    │  │  └─ get-current-user.ts
    │  ├─ security/
    │  │  ├─ redact-sensitive-text.ts
    │  │  └─ should-store-original.ts
    │  └─ env/
    │     └─ env.ts
    │
    ├─ docs/
    │  ├─ PRD.md
    │  └─ ARCHITECTURE.md
    │
    ├─ public/
    ├─ package.json
    └─ tsconfig.json

## 10. 컴포넌트 분리 기준

컴포넌트는 화면 목적에 따라 분리합니다.

app/_components는 앱 전체에서 사용하는 공통 레이아웃 컴포넌트를 둡니다.

prompts/_components는 프롬프트 목록과 상세 화면 전용 컴포넌트를 둡니다.

write/_components는 프롬프트 작성과 저장 전 검사 흐름을 담당합니다.

safecheck/_components는 AI SafeCheck 검사 UI를 담당합니다.

admin/_components는 정책 설정 화면을 담당합니다.

reports/_components는 검사 리포트 조회 화면을 담당합니다.

shared/ui는 버튼, 카드, 입력창, 텍스트영역, 배지, 다이얼로그, 스피너 같은 재사용 UI만 둡니다.

## 11. features 분리 기준

features는 도메인별 비즈니스 로직을 담당합니다.

features/prompts는 프롬프트 CRUD를 담당합니다.

features/safecheck는 AI SafeCheck 검사 엔진을 담당합니다.

features/policy는 사용자별 정책과 금지어 설정을 담당합니다.

features/reports는 검사 리포트 저장과 조회를 담당합니다.

features/auth는 인증 관련 타입과 검증을 담당합니다.

화면 컴포넌트에서는 Supabase 쿼리를 직접 작성하지 않습니다.

Supabase 접근은 features 하위 server 파일 또는 server/db 파일을 통해 수행합니다.

## 12. Prompt CRUD 처리 흐름

Prompt 생성 흐름은 다음과 같습니다.

1. 사용자가 /write에서 프롬프트를 작성합니다.
2. PromptForm.client가 입력값을 관리합니다.
3. 저장 전 SafeCheckPanel이 AI SafeCheck 검사를 실행합니다.
4. 검사 결과가 안전하면 저장 버튼을 활성화합니다.
5. create-prompt.ts가 입력값을 검증합니다.
6. Supabase에 프롬프트를 저장합니다.
7. 저장 후 /dashboard 또는 /prompts/[id]로 이동합니다.

Prompt 조회 흐름은 다음과 같습니다.

1. /prompts 페이지에서 get-prompts.ts를 호출합니다.
2. Supabase에서 공개 프롬프트 목록을 조회합니다.
3. PromptList와 PromptCard가 결과를 렌더링합니다.

Prompt 수정 흐름은 다음과 같습니다.

1. 사용자가 내 프롬프트를 수정합니다.
2. update-prompt.ts가 소유자와 입력값을 검증합니다.
3. Supabase에 수정 내용을 저장합니다.

Prompt 삭제 흐름은 다음과 같습니다.

1. 사용자가 내 프롬프트를 삭제합니다.
2. delete-prompt.ts가 소유자를 확인합니다.
3. 삭제하거나 status를 archived로 변경합니다.

MVP에서는 실제 삭제보다 archived 처리 방식을 우선 고려합니다.

## 13. AI SafeCheck 처리 흐름

AI SafeCheck 처리 흐름은 다음과 같습니다.

1. 사용자가 프롬프트 본문을 입력합니다.
2. normalize-input.ts가 텍스트를 정규화합니다.
3. detectors가 위험 항목을 탐지합니다.
4. merge-risk-findings.ts가 중복 탐지를 병합합니다.
5. calculate-risk-score.ts가 위험 점수를 계산합니다.
6. decide-risk-level.ts가 최종 판정을 결정합니다.
7. build-safe-prompt.ts가 안전 문장을 생성합니다.
8. UI가 점수, 판정, 탐지 근거, 안전 문장을 표시합니다.
9. report 저장이 필요한 경우 민감 원문 없이 메타데이터만 저장합니다.

최종 판정은 LLM이 아니라 rule 기반 로직이 담당합니다.

LLM은 MVP에서 필수 의존으로 두지 않습니다.

## 14. Auth 처리 흐름

로그인 흐름은 다음과 같습니다.

1. 사용자가 /login으로 이동합니다.
2. LoginForm.client에서 이메일 로그인 또는 OAuth 로그인을 실행합니다.
3. Supabase가 /auth/callback으로 돌아옵니다.
4. callback route가 세션 쿠키를 설정합니다.
5. 로그인 성공 후 /dashboard로 이동합니다.

보호 페이지 흐름은 다음과 같습니다.

1. /dashboard, /write, /admin, /reports 페이지에 접근합니다.
2. 서버 컴포넌트에서 get-current-user.ts를 호출합니다.
3. 사용자가 없으면 /login으로 redirect합니다.
4. 사용자가 있으면 페이지를 렌더링합니다.

무한로딩 방지를 위해 클라이언트에서 인증 상태를 기다리며 무한 로딩하지 않습니다.

## 15. 환경변수 관리

환경변수는 server/env/env.ts에서 검증합니다.

필수 환경변수는 다음과 같습니다.

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

사용하지 않을 환경변수는 다음과 같습니다.

- SUPABASE_SERVICE_ROLE_KEY

service_role key는 MVP에서 사용하지 않습니다.

환경변수가 없으면 화면에서 계속 로딩하지 않고 설정 오류 메시지를 표시합니다.

## 16. 테스트 구조

테스트는 v3 재구축 과정에서 새로 추가합니다.

목표 테스트는 다음과 같습니다.

- safecheck detector test
- risk score test
- scan-text regression test
- prompt schema test
- prompt CRUD test
- policy schema test
- auth guard test

검증 명령은 다음과 같습니다.

    npx tsc --noEmit
    npm test
    npm run build

현재 기존 PromptLab에는 npm test script가 없으므로, v3 재구축 과정에서 Vitest 기반 test script를 추가합니다.

## 17. 마이그레이션 원칙

기존 PromptLab의 로딩 이슈는 분석하지 않습니다.

기존 900여 개 프롬프트는 핵심 데이터로 유지하지 않습니다.

기존 데이터는 필요하면 archive 처리합니다.

새 데이터는 고품질 프롬프트 30~50개로 시작합니다.

기존 코드에서 재사용 가능한 부분만 선별적으로 가져옵니다.

불안정한 화면 구조는 유지하지 않습니다.

## 18. 고품질 프롬프트 기준

새 PromptLab에는 단순한 한 줄 프롬프트를 대량으로 넣지 않습니다.

프롬프트는 다음 요소를 포함해야 합니다.

- 제목
- 카테고리
- 사용 목적
- 프롬프트 본문
- 입력 변수
- 예시 입력
- 예시 출력
- 안전 주의사항
- 추천 사용 상황

AI SafeCheck 검사를 통과한 프롬프트만 공개하는 구조를 목표로 합니다.

## 19. 구현 우선순위

구현 우선순위는 다음과 같습니다.

1. 현재 이름 정리 완료 확인
2. PRD와 Architecture 문서 작성
3. Supabase Free 프로젝트 상태 정리
4. 환경변수 정리
5. 기본 폴더 구조 생성
6. shared/ui 생성
7. Supabase Auth 구현
8. prompt schema와 prompt CRUD 구현
9. prompts 목록과 상세 화면 구현
10. write 화면 구현
11. AI SafeCheck 엔진 이식
12. SafeCheck UI 구현
13. 저장 전 검사 연결
14. report 메타데이터 저장
15. admin 정책 설정 구현
16. 테스트 추가
17. README 재작성
18. 데모 시나리오 작성
19. Vercel 배포 확인

## 20. 금지 사항

아래 작업은 MVP에서 하지 않습니다.

- 기존 로딩 이슈 원인 분석
- 기존 900여 개 프롬프트 유지
- service_role key 사용
- 유료 Supabase 기능 사용
- 유료 Vercel 기능 사용
- 대용량 파일 업로드
- PDF/HWP/OCR 분석
- 결제 기능
- 기업 SSO
- 외부 유료 LLM API 필수 의존
- 화면 컴포넌트 안에 DB 쿼리 직접 작성
- 임시방편 로딩 처리
- 무한 재시도 구조

## 21. README 반영 계획

README에는 다음 내용을 반영합니다.

- PromptLab v3 소개
- 배포 링크
- 고객 정의
- 문제 정의
- 주요 기능
- 수업 커리큘럼 반영표
- 기술 스택
- 프로젝트 구조
- 컴포넌트 분리 기준
- Supabase Auth/CRUD 설명
- AI SafeCheck 통합 설명
- 보안 설계 원칙
- 무료 플랜 운영 원칙
- 실행 방법
- 테스트 방법
- 현재 한계
- 향후 개선 계획
- 데모 시나리오

## 22. 데모데이 구조

데모데이 흐름은 다음과 같습니다.

1. PromptLab v3 문제 정의 설명
2. 기존 저품질 프롬프트와 로딩 문제로 v3 재구축 결정 설명
3. 로그인 시연
4. 프롬프트 작성 시연
5. AI SafeCheck 검사 시연
6. 위험 점수와 안전 문장 확인
7. 수정된 프롬프트 저장
8. 내 프롬프트 목록 확인
9. Supabase Auth와 CRUD 설명
10. 컴포넌트 분리 구조 설명
11. 테스트와 배포 결과 설명

## 23. 현재 결정 사항

PromptLab을 메인 브랜드로 유지합니다.

AI SafeCheck는 PromptLab 내부 안전 검사 모듈로 통합합니다.

기존 로딩 이슈는 분석하지 않습니다.

기존 900여 개 프롬프트는 핵심 데이터로 유지하지 않습니다.

무료 플랜 기준으로 구현합니다.

컴포넌트와 로직을 세분화합니다.

Supabase Auth와 CRUD를 실제 구현합니다.

수업 커리큘럼 전체를 README와 발표에 반영합니다.