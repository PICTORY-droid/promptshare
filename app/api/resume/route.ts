// app/api/resume/route.ts
// OpenRouter 무료 텍스트 모델 기반 — 비용 0원

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://promptlab.io.kr",
    "X-Title": "PromptLab",
  },
});

const TEXT_MODELS = [
  "openrouter/auto",
  "nousresearch/hermes-3-llama-3.1-405b:free",
  "google/gemma-3-12b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

async function callWithFallback(prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of TEXT_MODELS) {
    try {
      console.log(`[Resume] 모델 시도: ${model}`);
      const response = await client.chat.completions.create({
        model,
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      });

      const result = response.choices[0]?.message?.content;
      if (result) {
        console.log(`[Resume] 성공: ${model}`);
        return result;
      }
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      const status = err?.status;
      console.warn(`[Resume] 실패 (${model}): ${status} ${err?.message}`);

      if (status === 429 || status === 404 || status === 503) {
        lastError = error instanceof Error ? error : new Error(String(error));
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("모든 모델에서 응답을 받지 못했습니다.");
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/>\s/g, "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobText,
      resumeText,
      userInfo,
    }: {
      jobText?: string;
      resumeText?: string;
      userInfo?: string;
    } = body;

    if (!jobText?.trim()) {
      return NextResponse.json(
        { error: "채용공고 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const hasResume = !!resumeText?.trim();

    const resumeSection = hasResume
      ? `아래는 지원자의 이력서입니다. 이력서에 실제로 적힌 내용만 사용하세요.\n\n[이력서]\n${resumeText}`
      : `이력서가 제공되지 않아 일반적인 신입 지원자 기준으로 작성합니다.`;

    const userInfoSection = userInfo?.trim()
      ? `\n\n[추가 정보]\n${userInfo.trim()}`
      : "";

    const prompt = `당신은 삼성전자·구글 출신 10년 경력 채용 전문가입니다. 아래 채용공고와 이력서를 보고 자기소개서를 작성하세요.

[채용공고]
${jobText}

${resumeSection}${userInfoSection}

━━━ 절대 원칙 — 하나라도 어기면 전체 재작성 ━━━

[원칙 0. 출력 형식]
- ** * _ # > 기호 출력 완전 금지
- 소제목, 항목 번호(I. II. 1. 2.), 불릿포인트 본문 내 사용 금지
- 순수 텍스트로만 작성

[원칙 1. 환각 금지]
- 이력서에 실제로 적힌 내용만 사용
- 이미지에 없는 수치·경험·회사명·프로젝트명 절대 생성 금지
- 이력서 없는 경우: 수치/경험 자리에 [본인 경험 입력] 또는 [수치 직접 입력]으로 표시
- 이력서 수치는 그대로 사용, 임의 변경·추정 금지

[원칙 2. 첫 문장 규칙 — 가장 중요]
- 모든 항목의 첫 문장은 반드시 숫자 또는 구체적 상황으로 시작
- "저는~" 시작 완전 금지
- "~경험이 일치합니다" 시작 완전 금지
- 나쁜 예: "1년 5개월간 영업 경험이 이 직무와 일치합니다"
- 좋은 예: "모집 마감 3일 전, 신청자가 목표치의 40%였다"
- 좋은 예: "신입 상담사 3명이 첫 주에 그만뒀다"

[원칙 3. 금지 문장 패턴]
아래 표현은 AI 탐지 시스템이 즉시 감지한다. 절대 사용 금지:
- "이러한 경험을 통해"
- "이러한 경험은 ~을 보여줍니다"
- "~역량을 키웠습니다"
- "~에 기여하겠습니다"
- "~을 통해 ~을 배웠습니다"
- "~한 경험이 있습니다"
- "열정, 도전, 성장, 기여, 발전, 최선, 노력, 하고자, 드리겠습니다, 해왔습니다, 통해, 위해, 바탕으로, 역량을 키워"

[원칙 4. 문체 규칙]
- Burstiness 필수: 짧은 문장(7~15자)과 긴 문장(40자 이상)을 불규칙하게 교차
- 좋은 예: "이틀을 날렸다. 배포 직전이었고 팀장은 이미 QA 단계에 들어가 있었다"
- 서술어 다양하게: ~했다 / ~이었다 / ~이 문제였다 / ~가 틀렸다 / ~로 바꿨다
- 딱 떨어지는 수치 금지: "50% 향상" 대신 "47.3% 향상", "3배" 대신 "2.8배"
- 동일 문장 구조 연속 금지: "~했습니다. ~했습니다. ~했습니다." 패턴 금지

[원칙 5. 내용 기준]
- 실패 또는 시행착오 경험 반드시 1개 이상 포함
- 회사 칭찬 완전 금지: "글로벌 기업인 ~", "업계 최고의 ~" 류
- 내 경험이 이 직무와 왜 맞는지만 서술
- 마지막 문장을 포부나 다짐으로 끝내지 말 것 — 구체적 계획이나 사실로 끝낼 것
- 자소서 내용은 면접에서 그대로 답변 가능한 수준

[원칙 6. 분량]
- 각 항목 400~500자
- 문단 구분 없이 하나의 흐름으로 작성

출력 형식 (이 형식 그대로, 순서 변경 금지):

[채용공고 분석]
- 회사명: 
- 직무: 
- 핵심 요구 역량 3가지: 
${hasResume ? `
[이력서에서 사용한 정보 — 직접 확인하세요]
- 학력: 
- 주요 경력/프로젝트: 
- 기술 스택: 
- 자격증: 
- 사용한 수치: (이력서에서 가져온 수치만 나열)
` : `
[이력서 미제공 — 아래 빈칸을 직접 채워주세요]
- 주요 경력/프로젝트: [직접 입력]
- 보유 기술: [직접 입력]
- 관련 수치/성과: [직접 입력]
`}
[자기소개서]

1. 지원 동기
(내용)

2. 성장 과정
(내용)

3. 직무 역량
(내용)

4. 입사 후 포부
(내용)`;

    const rawResult = await callWithFallback(prompt);
    const result = stripMarkdown(rawResult);

    return NextResponse.json({ resume: result });
  } catch (error: unknown) {
    console.error("Resume API error:", error);
    const msg = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json(
      { error: `오류가 발생했습니다: ${msg}` },
      { status: 500 }
    );
  }
}