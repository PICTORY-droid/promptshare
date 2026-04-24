// app/api/resume/route.ts
// Groq 무료 티어 기반 — 비용 0원

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const TEXT_MODELS = [
  "qwen/qwen3-32b",
  "llama-3.3-70b-versatile",
  "llama3-70b-8192",
];

async function callWithFallback(
  messages: { role: "system" | "user" | "assistant"; content: string }[]
): Promise<string> {
  let lastError: Error | null = null;

  for (const model of TEXT_MODELS) {
    try {
      console.log(`[Resume] 모델 시도: ${model}`);
      const response = await client.chat.completions.create({
        model,
        max_tokens: 4000,
        temperature: 0.85,
        messages,
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

      if (
        status === 429 ||
        status === 404 ||
        status === 503 ||
        status === 400 ||
        status === 413
      ) {
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

function removeForeignChars(text: string): string {
  return text
    .replace(/\b(planning|plan)\b/gi, "계획 수립")
    .replace(/\b(execution|execute)\b/gi, "실행")
    .replace(/\b(skill[s]?)\b/gi, "능력")
    .replace(/\b(effort[s]?)\b/gi, "꾸준한 실천")
    .replace(/\b(goal[s]?)\b/gi, "목표")
    .replace(/\b(challenge[s]?)\b/gi, "과제")
    .replace(/\b(management)\b/gi, "관리")
    .replace(/\b(government)\b/gi, "정부")
    .replace(/\b(company)\b/gi, "회사")
    .replace(/[\u4e00-\u9fff]/g, "")
    .replace(/[\u3040-\u309f]/g, "")
    .replace(/[\u30a0-\u30ff]/g, "")
    .replace(/[\u0900-\u097f]/g, "")
    .replace(/[\u0400-\u04ff]/g, "")
    .replace(/[\u0600-\u06ff]/g, "")
    .replace(/[\u0e00-\u0e7f]/g, "")
    .replace(/[\u1e00-\u1eff]/g, "")
    .replace(/[a-zA-Z]{4,}/g, (match) => {
      const whitelist = ["AIPD", "AIPT", "GAC", "SNS", "B2B", "AI", "PM", "LLM", "DB", "UI", "UX", "KPI", "ATS", "POT", "STEP"];
      if (whitelist.some((w) => match.toUpperCase() === w)) return match;
      return "";
    })
    .replace(/\s{2,}/g, " ")
    .trim();
}

// 이력서 빈 값 정제 — "- 기술 스택: , , ," 같은 줄 제거
function cleanResumeText(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      const valueMatch = line.match(/^[-\s]*[^:]+:\s*(.*)$/);
      if (valueMatch) {
        const value = valueMatch[1].replace(/[,\s]/g, "");
        if (!value) return false;
      }
      return true;
    })
    .join("\n");
}

// ─────────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `당신은 삼성전자·구글 채용팀 출신 15년 경력 수석 컨설턴트이자 글로벌 자기소개서 자동화 시스템을 설계한 프롬프트 엔지니어입니다.

━━━ 절대 규칙 (하나라도 위반하면 전체 출력 무효) ━━━
1. 한국어 존댓말(~했습니다, ~입니다)로만 작성. 반말 절대 금지.
2. 영어·외국어 문자(한자·일본어·베트남어·힌디어·독일어·러시아어 등) 절대 금지.
3. 마크다운 기호(** * # _ >) 절대 금지.
4. 소제목·불릿포인트·번호 목록 절대 금지 (자소서 본문 내).
5. 이력서에 없는 경험·수치·프로젝트 생성(환각) 절대 금지. 없으면 [본인 경험 입력] 표시.
6. 아래 예시 문장을 그대로 복사하는 것 절대 금지. 예시는 리듬과 구조만 참고.

━━━ AI 탐지 회피 — Burstiness 강제 ━━━
규칙 A. 문장 길이를 반드시 불규칙하게 교차.
  금지(균일): "~했습니다. ~했습니다. ~했습니다."
  필수(불규칙): 짧은 문장(8~15자) → 긴 문장(35~60자) → 짧은 문장 순서로 반복.

규칙 B. 동일 어미 연속 2회 이상 금지.
  금지: "~습니다. ~습니다." / "~입니다. ~입니다."
  필수: "~했습니다. ~였습니다. ~입니다. ~했던 것입니다."처럼 다양하게.

규칙 C. 수치는 비정형으로.
  금지: "3개월", "50%", "10건"
  필수: "11주", "47.3%", "9건"처럼 딱 떨어지지 않게.

규칙 D. 금지 표현 목록 (하나라도 나오면 해당 문장 재작성):
  열정, 노력, 기여, 최선, 성장, 도전,
  역량을 키웠습니다, 이러한 경험을 통해, 이를 통해,
  ~에 부합합니다, ~하고자 합니다, ~드리겠습니다,
  이렇게, 이러한, 이와 같이, 이처럼,
  생각합니다(단독 문장 마무리), 느꼈습니다(단독 마무리),
  조직의 성장에 기여하겠습니다, 새로운 아이디어를 제안하겠습니다,
  책임감을 가지고, 성실히 수행하겠습니다,
  더 나은, 함께 성장, 발전하겠습니다, 기여할 수 있을 것입니다,
  ~할 것입니다(단독 마무리), 중요하다는 것을 알게 되었습니다,
  관심을 가지게 되었습니다, 일하고 싶습니다

━━━ 삼성·구글 인사담당자 신뢰 기준 ━━━
기준 1. 첫 문장: 구체적 숫자 또는 현장 장면으로 시작. "저는~" 절대 금지.
기준 2. STAR 구조(상황→과제→행동→결과) + 두괄식(결론 먼저) 필수.
기준 3. 실패·시행착오 경험 반드시 포함. 면접에서 "그때 구체적으로 어떻게 했나요?" 질문에 답할 수 있는 수준.
기준 4. 회사 칭찬 금지. 내 경험이 이 직무와 왜 맞는지만 작성.
기준 5. 이력서 원문 사실만 사용. 면접 검증 가능해야 함.
기준 6. 마지막 문장: 막연한 다짐 금지. 구체적 수치·기간·계획으로 마무리.
기준 7. 각 항목 최소 500자. 전체 최소 2000자.`;

// ─────────────────────────────────────────────────────────────
// POST 핸들러
// ─────────────────────────────────────────────────────────────
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
    const cleanedResume = hasResume ? cleanResumeText(resumeText!.trim()) : "";

    const resumeSection = hasResume
      ? `아래는 지원자의 이력서입니다. 반드시 이 내용만 사용하세요. 이력서에 없는 내용은 절대 생성하지 말고 [본인 경험 입력]으로 표시하세요.\n\n[이력서]\n${cleanedResume}`
      : `이력서가 제공되지 않았습니다. 채용공고 직무에 맞는 일반적 신입 기준으로 작성하되, 구체적 수치·경험은 모두 [본인 경험 입력]으로 표시하세요.`;

    const userInfoSection = userInfo?.trim()
      ? `\n\n[지원자 추가 정보]\n${userInfo.trim()}`
      : "";

    const userPrompt = `아래 채용공고와 이력서를 보고 자기소개서를 작성하세요.

[채용공고]
${jobText}

${resumeSection}${userInfoSection}

━━━ 작성 전 체크리스트 ━━━
□ 이력서에 없는 수치·경험·프로젝트 생성 금지 — 없으면 [본인 경험 입력]
□ 이력서의 기간·수치 그대로 사용 (비정형 변환 가능: "4개월" → "17주")
□ 첫 문장: 숫자 또는 현장 장면으로 시작 ("저는~" 금지)
□ 짧은 문장↔긴 문장 불규칙 교차 필수
□ 동일 어미 연속 2회 이상 금지
□ 금지 표현 목록 위반 금지
□ 실패·시행착오 경험 반드시 1개 이상 포함
□ 마지막 문장: 구체적 수치·계획으로 마무리
□ 예시 문장 그대로 복사 금지 — 리듬과 구조만 참고

━━━ 문체 리듬 예시 (리듬만 참고, 문장 자체 복사 금지) ━━━

[리듬 예시 A — 짧음→김→짧음 교차]
결과가 없었습니다. 3주 동안 매일 홍보물을 배포했지만 문의 전화는 단 한 통도 오지 않았습니다. 채널이 문제였습니다.

[리듬 예시 B — 장면으로 시작 + STAR]
마감 47시간 전, 신청자 수는 목표의 29%였습니다. 팀 전체가 포기하는 분위기였습니다. 그날 밤 혼자 홍보 전략을 처음부터 다시 짰습니다. 단체 발송 대신 지역 운영자 90곳에 직접 연락했고, 다음날 오전에만 43건이 접수됐습니다.

[리듬 예시 C — 수치로 마무리]
6개월 안에 담당 수강생 수료율을 현재 대비 15% 이상 높이는 것을 첫 번째 기준으로 삼겠습니다. 3년 차에는 유입 경로별 전환율 데이터를 직접 구축해 홍보 방식을 수치 기반으로 전환하겠습니다.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

출력 형식 (아래 형식 그대로, 기호·마크다운 없이):

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
- 사용한 수치: 
` : `
[이력서 미제공 — 아래 빈칸을 직접 채워주세요]
- 주요 경력/프로젝트: [직접 입력]
- 보유 기술: [직접 입력]
- 관련 수치/성과: [직접 입력]
`}
[자기소개서]

1. 지원 동기
(500자 이상 | 존댓말 | 첫 문장: 숫자 또는 현장 장면)

2. 성장 과정
(500자 이상 | 존댓말 | 실패 경험 포함)

3. 직무 역량
(500자 이상 | 존댓말 | 이력서 수치 활용)

4. 입사 후 포부
(500자 이상 | 존댓말 | 마지막 문장: 구체적 수치·기간 목표)`;

    const messages: {
      role: "system" | "user" | "assistant";
      content: string;
    }[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    const rawResult = await callWithFallback(messages);
    const cleaned = stripMarkdown(rawResult);
    const result = removeForeignChars(cleaned);

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