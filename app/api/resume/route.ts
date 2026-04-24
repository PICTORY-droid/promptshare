// app/api/resume/route.ts
// Groq 무료 티어 기반 — 비용 0원

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const TEXT_MODELS = [
  "llama-3.3-70b-versatile",
  "llama3-70b-8192",
  "llama-3.1-8b-instant",
];

async function callWithFallback(prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of TEXT_MODELS) {
    try {
      console.log(`[Resume] 모델 시도: ${model}`);
      const response = await client.chat.completions.create({
        model,
        max_tokens: 6000,
        messages: [
          {
            role: "system",
            content: `당신은 삼성전자·구글 출신 10년 경력 한국 채용 전문가입니다.
반드시 한국어로만 작성하세요. 영어, 중국어, 일본어, 인도네시아어 등 외국어 단어나 문자를 단 하나도 사용하지 마세요.
모든 외래어는 한국어로 풀어쓰세요. 예: planning→계획 수립, execution→실행, skill→능력, effort→노력(이것도 금지이므로 다른 표현으로).`,
          },
          { role: "user", content: prompt },
        ],
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
        await new Promise((res) => setTimeout(res, 1000));
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

// 외국어 문자 후처리 제거
function removeForeinChars(text: string): string {
  // 중국어/일본어 한자 범위 제거 (한국 한자 제외하고 문맥상 이상한 경우)
  // 라틴 알파벳 단어 한국어로 치환 가능한 것들
  return text
    .replace(/\b(planning|plan)\b/gi, "계획 수립")
    .replace(/\b(execution|execute)\b/gi, "실행")
    .replace(/\b(skill[s]?)\b/gi, "능력")
    .replace(/\b(effort[s]?)\b/gi, "꾸준한 실천")
    .replace(/\b(goal[s]?)\b/gi, "목표")
    .replace(/\b(akademik)\b/gi, "학업")
    .replace(/\b(management)\b/gi, "관리")
    .replace(/\b(challenge[s]?)\b/gi, "과제")
    .replace(/[挑戰満足不断]/g, "")
    .replace(/[\u4e00-\u9fff]/g, "") // 중국어 한자
    .replace(/[\u3040-\u309f\u30a0-\u30ff]/g, "") // 일본어 히라가나·카타카나
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

    const prompt = `아래 채용공고와 이력서를 보고 한국 취업용 자기소개서를 작성하세요.

[채용공고]
${jobText}

${resumeSection}${userInfoSection}

━━━ 절대 원칙 — 하나라도 어기면 전체 재작성 ━━━

[언어 원칙 — 최우선]
- 반드시 한국어로만 작성
- 영어 단어 완전 금지: planning, skill, execution, effort, goal, challenge, management 등
- 중국어·일본어·기타 외국어 문자 완전 금지
- 외래어는 반드시 한국어로 풀어쓸 것

[형식 원칙]
- ** * _ # > 기호 출력 완전 금지
- 소제목, 불릿포인트 본문 내 사용 금지
- 순수 텍스트로만 작성

[분량 원칙 — 반드시 준수]
- 자기소개서 전체 합산 최소 2000자 이상
- 각 항목(지원 동기·성장 과정·직무 역량·입사 후 포부) 최소 500자씩
- 분량이 부족하면 구체적 에피소드를 추가해서 채울 것

[환각 금지]
- 이력서에 실제로 적힌 내용만 사용
- 없는 수치·경험·회사명·프로젝트명 절대 생성 금지
- 이력서 없는 경우: [본인 경험 입력] 또는 [수치 직접 입력]으로 표시
- 이력서 수치는 그대로 사용, 임의 변경·추정 금지

[첫 문장 원칙]
- 모든 항목 첫 문장: 반드시 구체적 숫자 또는 생생한 현장 장면으로 시작
- 완전 금지: "저는~", "~경험이 일치합니다", "~년 ~월부터", "~동안 ~했습니다"
- 나쁜 예: "2년 동안 프리랜서로 근무하면서..."
- 나쁜 예: "저는 다양한 경험을 통해..."
- 좋은 예: "마감 3일 전, 모집 인원의 절반도 채우지 못한 상황이었다"
- 좋은 예: "카드뉴스 하나로 지역 카페 90곳에 동시 홍보를 돌렸다"
- 좋은 예: "상담 첫 통화에서 수강생이 전화를 끊었다"

[금지 표현 — 사용 즉시 재작성]
다음 표현은 AI가 쓰는 전형적인 패턴이므로 절대 사용 금지:
- "이러한 경험을 통해"
- "~역량을 키웠습니다"
- "~에 기여하겠습니다"
- "~을 통해 ~을 배웠습니다"
- "~한 경험이 있습니다"
- "~을 바탕으로"
- "~에 부합한다고 생각합니다"
- "~하고 싶습니다"
- "최선을 다하겠습니다"
- "열심히 하겠습니다"
- 열정, 도전, 성장, 기여, 발전, 최선, 노력, 하고자, 드리겠습니다, 해왔습니다, 위해, 역량을 키워

[문체 원칙]
- 짧은 문장(10자 이내)과 긴 문장(40자 이상)을 불규칙하게 교차
- 예시: "틀렸다. 처음 설계한 홍보 방식은 타깃 연령층과 전혀 맞지 않았고, 3주가 지나도록 신청자가 한 명도 없었다"
- 서술어 다양하게 변화: ~했다 / ~이었다 / ~이 문제였다 / ~가 달랐다 / ~로 바꿨다
- 딱 떨어지는 수치 금지: "50%" 대신 "47%", "2배" 대신 "1.9배"
- "~했습니다. ~했습니다. ~했습니다." 동일 구조 3회 이상 연속 금지

[내용 원칙]
- 실패 또는 시행착오 에피소드 반드시 1개 이상 포함 (이력서 근거)
- 회사 칭찬 완전 금지: "귀원", "귀사", "훌륭한", "업계 최고" 류
- 마지막 문장: "~하겠습니다" 다짐 금지 — 구체적 계획이나 수치 목표로 끝낼 것
- 면접에서 그대로 답변 가능한 수준의 구체성 유지

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
(최소 500자, 구체적 에피소드 포함)

2. 성장 과정
(최소 500자, 실패 경험 포함)

3. 직무 역량
(최소 500자, 수치 근거 포함)

4. 입사 후 포부
(최소 500자, 구체적 1년·3년 계획)`;

    const rawResult = await callWithFallback(prompt);
    const cleaned = stripMarkdown(rawResult);
    const result = removeForeinChars(cleaned);

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