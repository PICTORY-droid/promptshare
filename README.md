# 🧪 PromptLab

> AI 프롬프트 학습 플랫폼 — 검증된 프롬프트를 배우고 활용하세요

## 왜 만들었나

AI 툴이 쏟아지는 시대에 좋은 프롬프트를 어떻게 써야 하는지 모르는 사람이 많습니다. 
잘 만들어진 프롬프트를 카테고리별로 모아 학습할 수 있는 플랫폼을 만들었습니다.

## 주요 기능

- 카테고리별 프롬프트 탐색
- 최신순 프롬프트 정렬
- 프롬프트 상세 내용 열람
- 빠른 로딩을 위한 서버사이드 렌더링 (ISR)

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | Next.js, TypeScript, Tailwind CSS |
| 백엔드/DB | Supabase (PostgreSQL) |
| 배포 | Vercel |
| 폰트 | Geist (Vercel) |

## 시작하는 방법

1. 패키지 설치

\`\`\`bash
npm install
\`\`\`

2. .env.local 파일 생성 후 아래 내용 입력

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

3. 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 http://localhost:3000 접속

## 현황

- 현재 프롬프트 수: 976개
- 목표: 50,000개

## 라이선스

MIT License
