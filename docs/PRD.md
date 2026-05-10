# PromptLab v3 PRD

## 1. 프로젝트 개요

PromptLab v3는 AI 프롬프트를 만들고, 저장하고, 검증하고, 안전하게 활용하는 웹 서비스입니다.

기존 PromptLab은 운영 도메인과 브랜드는 유지하되, 로딩 이슈와 낮은 프롬프트 품질 문제를 해결하기 위해 v3 구조로 재구축합니다.

AI SafeCheck는 PromptLab 내부의 안전 검사 모듈로 통합합니다. 사용자가 프롬프트를 저장하거나 외부 AI에 입력하기 전에 개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 검사합니다.

운영 도메인은 다음 주소를 유지합니다.

https://promptlab.io.kr

## 2. 브랜드 아이덴티티

서비스명은 PromptLab입니다.

PromptLab은 프롬프트를 단순히 모아두는 저장소가 아니라, 안전하고 재사용 가능한 AI 프롬프트를 만드는 작업실입니다.

AI SafeCheck는 PromptLab 안에서 프롬프트를 저장하기 전 위험 요소를 검사하는 안전 게이트입니다.

브랜드 구조는 다음과 같습니다.

PromptLab: 프롬프트 생성, 저장, 관리, 재사용 플랫폼

AI SafeCheck: 프롬프트 저장 전 안전 검사 모듈

한 줄 설명은 다음과 같습니다.

PromptLab은 프롬프트를 만들고, 저장하고, 안전하게 검증하는 AI 업무 플랫폼입니다.

## 3. 프로젝트 배경

생성형 AI 사용자는 점점 늘고 있지만, 실제 업무나 창작 과정에서 사용하는 프롬프트는 체계적으로 관리되지 않는 경우가 많습니다.

또한 사용자는 프롬프트 안에 고객명, 전화번호, 상담기록, 회사 내부자료, 계약정보, 저작권 위험 표현, 허위·과장 표현을 실수로 넣을 수 있습니다.

기존 PromptLab에는 많은 프롬프트가 있었지만, 900여 개의 기존 프롬프트는 전문성이 낮고 초보적인 내용이 많아 핵심 데이터로 유지하지 않습니다.

기존 로딩 이슈도 이미 장기간 수정 시도했기 때문에 원인 분석에 시간을 쓰지 않고, v3 구조로 재구축합니다.

## 4. 고객 정의

PromptLab v3의 주요 고객은 다음과 같습니다.

1. AI를 업무에 활용하는 직장인

보고서, 이메일, 고객 응대, 마케팅 문구, 상담 문장 등을 AI로 작성하려는 사용자입니다.

2. 프롬프트를 저장하고 재사용하려는 사용자

자주 쓰는 프롬프트를 체계적으로 저장하고, 목적별로 다시 활용하려는 사용자입니다.

3. 글쓰기 작가와 콘텐츠 제작자

블로그, 원고, 소설, 대본, SNS 콘텐츠를 만들 때 AI 프롬프트를 활용하는 사용자입니다.

4. 음악 생성 크리에이터

가사, 음악 콘셉트, 보컬 스타일, 곡 분위기 등을 AI 도구에 입력하는 사용자입니다.

5. 프리랜서와 컨설턴트

고객 프로젝트, 제안서, 계약 관련 문서, 상담 내용을 AI로 정리하려는 사용자입니다.

6. 교육생과 강사

AI 프롬프트 작성법을 배우거나 가르치는 사람입니다.

7. 소규모 팀 관리자

팀원들이 외부 AI에 민감정보를 입력하지 않도록 관리해야 하는 사용자입니다.

## 5. 문제 정의

PromptLab v3가 해결하려는 문제는 다음과 같습니다.

1. 프롬프트 품질 문제

프롬프트가 많아도 품질 기준이 없으면 실무에서 사용하기 어렵습니다.

2. 프롬프트 관리 문제

좋은 프롬프트를 다시 찾거나 재사용하기 어렵습니다.

3. 보안 문제

사용자가 AI에 고객명, 전화번호, 진료기록, 상담기록, 회사기밀을 실수로 입력할 수 있습니다.

4. 저작권과 창작 위험 문제

작가, 크리에이터, 음악 생성 사용자가 타인의 원문, 특정 작가 문체, 특정 가수 목소리, 기존 곡과 유사한 요청을 입력할 수 있습니다.

5. 신뢰성 문제

검증되지 않은 프롬프트가 많으면 플랫폼의 전문성이 떨어집니다.

6. 기존 로딩 이슈

기존 PromptLab의 로딩 이슈는 수리하지 않고 v3 구조로 재구축합니다.

## 6. 유저 스토리

직장인으로서, 나는 고객 정보를 AI에 입력하기 전에 위험 요소를 검사하고 싶다. 그래야 개인정보 유출을 줄일 수 있다.

프리랜서로서, 나는 고객 프로젝트 문구를 AI로 다듬기 전에 회사명과 계약정보를 제거하고 싶다. 그래야 고객 정보를 보호할 수 있다.

작가로서, 나는 글쓰기 프롬프트를 저장하기 전에 저작권 위험이나 특정 작가 모방 요청을 확인하고 싶다. 그래야 안전하게 창작할 수 있다.

음악 생성 크리에이터로서, 나는 특정 가수 목소리나 기존 곡을 그대로 따라 하라는 위험 요청을 피하고 싶다. 그래야 저작권과 초상권 위험을 줄일 수 있다.

교육생으로서, 나는 좋은 프롬프트를 예시와 함께 저장하고 학습하고 싶다. 그래야 AI 활용 능력을 높일 수 있다.

관리자로서, 나는 회사 정책상 금지어를 등록하고 팀원이 AI에 입력하기 전에 검사하고 싶다. 그래야 회사기밀 유출을 줄일 수 있다.

## 7. MVP 범위

PromptLab v3의 MVP 범위는 다음과 같습니다.

1. Supabase Auth 로그인

사용자는 이메일 기반으로 로그인합니다.

2. 프롬프트 CRUD

사용자는 프롬프트를 생성, 조회, 수정, 삭제할 수 있습니다.

3. 프롬프트 목록

사용자는 저장된 프롬프트 목록을 확인할 수 있습니다.

4. 프롬프트 작성 화면

사용자는 제목, 카테고리, 사용 목적, 프롬프트 본문, 변수, 예시를 입력할 수 있습니다.

5. AI SafeCheck 검사

프롬프트 저장 전 위험 요소를 검사합니다.

6. 안전 문장 제안

위험 요소가 있으면 안전한 문장으로 바꾼 결과를 제안합니다.

7. 관리자 정책 설정

사용자는 금지어와 저장 정책을 관리할 수 있습니다.

8. 검사 리포트 메타데이터 저장

검사 원문이 아니라 점수, 판정, 위험 카테고리, 정책 버전, 안전 문장만 저장합니다.

9. 고품질 프롬프트 소수 운영

기존 900여 개 프롬프트를 유지하지 않고, 30~50개 고품질 프롬프트로 시작합니다.

## 8. MVP에서 제외할 기능

아래 기능은 MVP에서 제외합니다.

대용량 파일 업로드

PDF 분석

HWP 분석

OCR

결제 기능

브라우저 확장 프로그램

기업 SSO

유료 LLM API 필수 의존

대용량 Storage

실시간 협업 편집

고급 관리자 대시보드

기존 로딩 이슈 원인 분석

기존 900여 개 프롬프트 유지

## 9. 핵심 기능 구조

PromptLab v3의 기능 구조는 다음과 같습니다.

홈

서비스 소개와 핵심 사용 흐름을 보여줍니다.

프롬프트 탐색

저장된 프롬프트를 카테고리와 검색으로 확인합니다.

프롬프트 작성

새 프롬프트를 작성하고 저장 전 AI SafeCheck 검사를 실행합니다.

내 프롬프트

로그인한 사용자가 저장한 프롬프트를 확인합니다.

AI SafeCheck

프롬프트의 개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 검사합니다.

관리자 정책

사용자별 금지어와 정책 설정을 관리합니다.

리포트

검사 결과의 메타데이터와 안전 문장 제안을 확인합니다.

## 10. AI SafeCheck 통합 방식

AI SafeCheck는 독립 서비스가 아니라 PromptLab 내부 안전 검사 모듈로 통합합니다.

통합 흐름은 다음과 같습니다.

1. 사용자가 프롬프트를 작성합니다.
2. 저장 전 AI SafeCheck 검사를 실행합니다.
3. detector가 위험 항목을 탐지합니다.
4. 위험 점수를 계산합니다.
5. 입력 가능, 수정 필요, 입력 금지 판정을 표시합니다.
6. 안전 문장을 제안합니다.
7. 사용자는 안전 문장으로 수정한 뒤 저장합니다.
8. 검사 원문은 저장하지 않고 메타데이터만 저장합니다.

AI SafeCheck에서 가져올 핵심 로직은 다음과 같습니다.

risk-policy

risk-patterns

risk-thresholds

policy-version

detectors

normalize-input

merge-risk-findings

calculate-risk-score

decide-risk-level

build-safe-prompt

scan-text

tests

## 11. Supabase Auth 계획

Supabase는 무료 플랜을 기준으로 사용합니다.

Authentication은 Supabase Auth를 사용합니다.

로그인 보호 원칙은 다음과 같습니다.

로그인 페이지는 공개합니다.

auth callback route는 공개합니다.

dashboard, write, admin, reports는 보호합니다.

middleware로 전체 페이지를 보호하지 않습니다.

서버 컴포넌트에서 세션을 확인합니다.

세션이 없으면 login으로 한 번만 redirect합니다.

클라이언트 useEffect에서 redirect를 반복하지 않습니다.

환경변수가 없으면 무한 로딩이 아니라 설정 오류 메시지를 표시합니다.

저장 실패 시 무한 재시도하지 않습니다.

## 12. Supabase DB 계획

초기 테이블은 다음과 같습니다.

promptlab_profiles

사용자 프로필 정보를 저장합니다.

promptlab_prompts

프롬프트 제목, 본문, 카테고리, 사용 목적, 공개 여부를 저장합니다.

promptlab_categories

프롬프트 카테고리를 저장합니다.

promptlab_safecheck_policies

사용자별 금지어와 정책을 저장합니다.

promptlab_safecheck_reports

검사 결과 메타데이터를 저장합니다.

저장하지 않을 데이터는 다음과 같습니다.

검사 원문 속 민감정보

고객명 원문

전화번호 원문

진료기록 원문

상담기록 원문

회사기밀 원문

## 13. CRUD 계획

Prompt CRUD는 다음과 같습니다.

Create

새 프롬프트를 저장합니다.

Read

프롬프트 목록, 상세 페이지, 내 프롬프트 목록을 조회합니다.

Update

프롬프트 제목, 본문, 카테고리, 공개 여부를 수정합니다.

Delete

프롬프트를 삭제하거나 비공개 처리합니다.

SafeCheck CRUD는 다음과 같습니다.

Create

검사 리포트 메타데이터를 저장합니다.

Read

내 검사 리포트를 조회합니다.

Update

관리자 정책을 수정합니다.

Delete

정책 초기화 또는 리포트 삭제는 MVP 이후 확장으로 둡니다.

## 14. 컴포넌트 분리 원칙

PromptLab v3는 화면, 컴포넌트, 비즈니스 로직, DB 접근, 검증, 테스트를 분리합니다.

화면 파일은 컴포넌트를 조립하는 역할만 합니다.

UI 상태와 이벤트는 client component에서 처리합니다.

서버 데이터 조회는 server component 또는 server function에서 처리합니다.

DB 접근은 server/db와 features 하위 server 로직에 둡니다.

검증은 schemas에 둡니다.

타입은 types에 둡니다.

공통 UI는 shared/ui에 둡니다.

보안 관련 로직은 server/security에 둡니다.

## 15. 예상 폴더 구조

예상 구조는 다음과 같습니다.

promptlab/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ _components/
│  ├─ login/
│  ├─ auth/
│  ├─ (marketing)/
│  ├─ (app)/
│  │  ├─ prompts/
│  │  ├─ write/
│  │  ├─ dashboard/
│  │  ├─ safecheck/
│  │  ├─ admin/
│  │  └─ reports/
│  └─ api/
├─ features/
│  ├─ prompts/
│  ├─ safecheck/
│  ├─ policy/
│  ├─ reports/
│  └─ auth/
├─ shared/
│  ├─ ui/
│  └─ lib/
├─ server/
│  ├─ db/
│  ├─ auth/
│  ├─ security/
│  └─ env/
├─ public/
├─ docs/
├─ package.json
└─ tsconfig.json

## 16. 페이지별 컴포넌트 계획

공통 컴포넌트는 다음과 같습니다.

AppHeader

AppLogo

AppNavigation

UserMenu

AuthStatus

홈 컴포넌트는 다음과 같습니다.

HeroSection

ProductOverview

SafeCheckIntro

QuickStart

프롬프트 목록 컴포넌트는 다음과 같습니다.

PromptList

PromptCard

PromptFilters.client

PromptSearch.client

PromptCategoryTabs.client

프롬프트 작성 컴포넌트는 다음과 같습니다.

PromptEditor.client

PromptForm.client

PromptMetadataForm.client

SafeCheckPanel

SavePromptButton.client

AI SafeCheck 컴포넌트는 다음과 같습니다.

SafeCheckShell

SafeCheckGuideCard

SafeCheckInput.client

SafeCheckResult

RiskDecisionBanner

RiskScoreCard

RiskEvidenceList

SafePromptPreview

ConsistencyMeta

관리자 컴포넌트는 다음과 같습니다.

AdminShell

PolicyForm.client

KeywordTable

AddKeywordDialog.client

리포트 컴포넌트는 다음과 같습니다.

ReportList

ReportFilters.client

ReportPolicyMeta

## 17. 테스트 계획

테스트는 다음을 포함합니다.

safecheck detector test

risk score test

scan-text regression test

prompt schema test

prompt CRUD test

policy schema test

auth guard test

빌드 전 검증 명령은 다음과 같습니다.

npx tsc --noEmit

npm test

npm run build

## 18. 수업 커리큘럼 반영표

Vibe Coding

AI와 함께 요구사항 정의, 구조 설계, 코드 생성, 오류 수정, 배포를 진행합니다.

Prompt

프롬프트 작성, 저장, 재사용 기능을 구현합니다.

Context

프롬프트 사용 목적, 변수, 예시, 안전 정책을 함께 관리합니다.

PRD

본 문서로 프로젝트 목적, 고객, 기능, 범위를 정의합니다.

고객 정의

직장인, 작가, 크리에이터, 프리랜서, 교육생, 관리자 등 주요 사용자를 정의합니다.

유저 스토리

사용자 관점의 기능 필요성을 정의합니다.

LLM

프롬프트 생성과 안전 문장 제안 구조에 LLM 확장 가능성을 둡니다.

AI Agent

AI SafeCheck를 하나의 검사 도구처럼 동작하는 모듈로 설계합니다.

Context Engineering

프롬프트 본문, 변수, 목적, 예시, 정책을 구조화합니다.

MCP

향후 SafeCheck를 tool adapter 또는 MCP-style 도구로 확장할 수 있게 설계합니다.

Rule

개인정보, 회사기밀, 저작권 위험, 과장 표현을 rule 기반 detector로 검사합니다.

Task 분해

화면, 로직, DB, 테스트, 배포 작업을 단계별로 나눕니다.

Git

GitHub 저장소를 사용하고 커밋 단위로 작업을 관리합니다.

배포

Vercel을 통해 promptlab.io.kr에 배포합니다.

Database

Supabase PostgreSQL을 사용합니다.

CRUD

프롬프트 생성, 조회, 수정, 삭제를 구현합니다.

Authentication

Supabase Auth를 사용합니다.

BaaS

Supabase를 BaaS로 사용합니다.

Firebase/Supabase

수업에서 배운 BaaS 개념 중 Supabase를 선택해 구현합니다.

바이브 디자인

브랜드 톤, UI 카드, 사용 안내, 로고, 시각 구성을 설계합니다.

시각 에셋

PromptLab 로고와 AI SafeCheck 아이콘을 관리합니다.

최종 프로젝트

PromptLab v3를 최종 프로젝트로 제출합니다.

데모데이

프롬프트 작성, SafeCheck 검사, 저장, 조회 흐름을 시연합니다.

## 19. 무료 플랜 운영 원칙

모든 구현은 무료 플랜 기준으로 진행합니다.

GitHub Free를 사용합니다.

Vercel Hobby를 사용합니다.

Supabase Free를 사용합니다.

Supabase Pro는 사용하지 않습니다.

Vercel Pro는 사용하지 않습니다.

Log Drains를 사용하지 않습니다.

대용량 Storage를 사용하지 않습니다.

외부 유료 LLM API를 필수 의존으로 두지 않습니다.

service_role key를 클라이언트에 노출하지 않습니다.

## 20. 데모 시나리오

데모 시나리오는 다음과 같습니다.

1. PromptLab 홈 화면을 보여줍니다.
2. 로그인합니다.
3. 프롬프트 작성 화면으로 이동합니다.
4. 프롬프트를 작성합니다.
5. 저장 전 AI SafeCheck 검사를 실행합니다.
6. 위험 항목과 점수를 확인합니다.
7. 안전 문장 제안을 확인합니다.
8. 수정된 프롬프트를 저장합니다.
9. 내 프롬프트 목록에서 저장 결과를 확인합니다.
10. Supabase Auth와 CRUD가 적용된 것을 설명합니다.
11. 컴포넌트 분리 구조를 설명합니다.
12. 테스트와 배포 결과를 설명합니다.

## 21. 현재 결정 사항

기존 로딩 이슈는 분석하지 않습니다.

기존 900여 개 프롬프트는 핵심 데이터로 유지하지 않습니다.

PromptLab v3로 재구축합니다.

AI SafeCheck는 PromptLab 내부 안전 검사 모듈로 통합합니다.

무료 플랜을 유지합니다.

컴포넌트와 로직을 세분화합니다.

수업 커리큘럼 전체가 README와 발표에 반영되도록 합니다.