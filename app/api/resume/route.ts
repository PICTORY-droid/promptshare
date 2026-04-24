// app/api/resume/route.ts
// Groq 무료 티어 기반 — 비용 0원
// Chain-of-Thought 강제 구조 — 모델이 규칙을 읽고 스스로 검토 후 출력

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
        temperature: 0.82,
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
      if ([429, 404, 503, 400, 413].includes(status ?? 0)) {
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
  const whitelist = ["AIPD", "AIPT", "GAC", "SNS", "B2B", "AI", "PM", "LLM", "DB", "UI", "UX", "KPI", "ATS", "POT"];
  return text
    .replace(/[\u4e00-\u9fff]/g, "")
    .replace(/[\u3040-\u309f]/g, "")
    .replace(/[\u30a0-\u30ff]/g, "")
    .replace(/[\u0900-\u097f]/g, "")
    .replace(/[\u0400-\u04ff]/g, "")
    .replace(/[\u0600-\u06ff]/g, "")
    .replace(/[\u0e00-\u0e7f]/g, "")
    .replace(/[\u1e00-\u1eff]/g, "")
    .replace(/[a-zA-Z]{3,}/g, (match) => {
      if (whitelist.some((w) => match.toUpperCase() === w)) return match;
      return "";
    })
    .replace(/\s{2,}/g, " ")
    .trim();
}

// 이력서 빈 값 정제
function cleanResumeText(text: string): string {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      // "항목: , ," 또는 "항목:" 처럼 실제 값이 없는 줄 제거
      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        const value = line.slice(colonIdx + 1).replace(/[,\s·]/g, "").trim();
        if (!value) return false;
      }
      return true;
    })
    .join("\n");
}

// CoT 검토 블록 제거 — 출력에서 <검토>...</검토> 태그 제거
function removeCoTBlock(text: string): string {
  return text
    .replace(/<검토>[\s\S]*?<\/검토>/g, "")
    .replace(/\[검토\][\s\S]*?\[\/검토\]/g, "")
    .replace(/검토:.*\n/g, "")
    .trim();
}

// ─────────────────────────────────────────────────────────────
// SYSTEM PROMPT — 역할 + 절대 규칙
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `당신은 삼성전자·구글 채용팀 출신 15년 경력 자기소개서 전문 컨설턴트입니다.
한국어 존댓말로만 작성합니다. 영어·외국어·마크다운 기호 절대 금지.

━━━ 절대 금지 표현 (출력 전 반드시 확인) ━━━
아래 표현이 하나라도 있으면 해당 문장을 즉시 다시 씁니다:
열정 / 노력 / 기여 / 최선 / 성장 / 도전 / 더 나은 /
이를 통해 / 이러한 경험을 통해 / 이렇게 / 이러한 / 이와 같이 /
~에 부합합니다 / ~하고자 합니다 / ~드리겠습니다 /
기여할 수 있을 것입니다 / 기여하고 싶습니다 /
중요하다는 것을 알게 되었습니다 / 생각하게 되었습니다 /
관심을 가지게 되었습니다 / 일하고 싶습니다 /
조직의 성장 / 함께 성장 / 발전하겠습니다 /
책임감을 가지고 / 성실히 수행 / 새로운 아이디어

━━━ Burstiness 규칙 (AI 탐지 회피) ━━━
짧은 문장(10자 이내)과 긴 문장(40자 이상)을 반드시 불규칙하게 교차합니다.
동일 어미(~습니다. ~습니다.)를 연속 2회 이상 쓰지 않습니다.
수치는 비정형으로: "3개월"→"13주", "50%"→"47.3%"

━━━ 인사담당자 신뢰 기준 ━━━
첫 문장: 숫자 또는 현장 장면. "저는~" 금지.
STAR 구조 + 두괄식 필수.
실패·시행착오 경험 반드시 포함.
회사 칭찬 금지. 이력서 원문 사실만 사용.
각 항목 600자 이상.`;

// ─────────────────────────────────────────────────────────────
// POST 핸들러
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobText, resumeText, userInfo }: {
      jobText?: string;
      resumeText?: string;
      userInfo?: string;
    } = body;

    if (!jobText?.trim()) {
      return NextResponse.json({ error: "채용공고 내용을 입력해주세요." }, { status: 400 });
    }

    const hasResume = !!resumeText?.trim();
    const cleanedResume = hasResume ? cleanResumeText(resumeText!.trim()) : "";

    const resumeSection = hasResume
      ? `[이력서 — 아래 내용만 사용, 없는 내용은 [본인 경험 입력] 표시]\n${cleanedResume}`
      : `[이력서 미제공 — 모든 수치·경험은 [본인 경험 입력] 표시]`;

    const userInfoSection = userInfo?.trim()
      ? `\n[추가 정보]\n${userInfo.trim()}`
      : "";

    // Chain-of-Thought: 각 항목 작성 전 스스로 점검하게 강제
    const userPrompt = `채용공고와 이력서를 보고 자기소개서를 작성하세요.

[채용공고]
${jobText}

${resumeSection}${userInfoSection}

━━━ 작성 방법 — Chain-of-Thought ━━━
각 항목을 작성하기 전에 반드시 아래 순서로 생각하고 작성합니다.

단계 1. 이력서에서 이 항목에 쓸 수 있는 실제 사실을 먼저 추출합니다.
단계 2. 첫 문장을 숫자 또는 현장 장면으로 구성합니다. ("저는~" 금지)
단계 3. STAR 구조(상황→문제→행동→결과)로 뼈대를 잡습니다.
단계 4. 짧은 문장과 긴 문장을 교차해서 씁니다.
단계 5. 금지 표현이 있는지 확인하고 있으면 즉시 교체합니다.
단계 6. 600자 이상인지 확인합니다.

━━━ 올바른 문체 기준 ━━━

[나쁜 예 — 절대 이렇게 쓰지 않습니다]
"교육마케팅에 관심을 가지게 되었습니다. 이를 통해 에듀위키에 기여하고 싶습니다. 이러한 경험을 통해 성장할 수 있었습니다."
→ 금지 표현 3개, 균일한 리듬, AI 탐지 즉시 걸림

[좋은 예 — 이 방향으로 씁니다]
"반응이 없었습니다. 47개 과정을 홍보하면서 전국 카페 90여 곳에 직접 자료를 배포했지만, 4주가 지나도록 문의 전화가 단 한 통도 오지 않았습니다. 채널이 틀렸다는 것을 그때 알았습니다. 지역 커뮤니티와 직장인 카페로 바꾸자 11일 만에 문의가 들어왔습니다."
→ 짧은 문장 시작, 구체적 수치, 실패→전환 구조, 금지 표현 없음

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

출력 형식 (마크다운·기호 없이):

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
[이력서 미제공 — 빈칸을 직접 채워주세요]
- 주요 경력/프로젝트: [직접 입력]
- 보유 기술: [직접 입력]
- 관련 수치/성과: [직접 입력]
`}
[자기소개서]

1. 지원 동기
점검: 첫 문장이 숫자·장면인가? 금지 표현이 없는가? 짧은 문장↔긴 문장 교차인가? 600자 이상인가?
(위 점검 후 본문 작성)

2. 성장 과정
점검: 실패 경험이 있는가? 동일 어미 연속이 없는가? 600자 이상인가?
(위 점검 후 본문 작성)

3. 직무 역량
점검: 이력서 수치만 사용했는가? "이를 통해·기여" 표현이 없는가? 600자 이상인가?
(위 점검 후 본문 작성)

4. 입사 후 포부
점검: 마지막 문장이 구체적 수치·기간인가? 회사 칭찬이 없는가? 600자 이상인가?
(위 점검 후 본문 작성)`;

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    const rawResult = await callWithFallback(messages);
    const noCoT = removeCoTBlock(rawResult);
    const cleaned = stripMarkdown(noCoT);
    const result = removeForeignChars(cleaned);

    return NextResponse.json({ resume: result });
  } catch (error: unknown) {
    console.error("Resume API error:", error);
    const msg = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json({ error: `오류가 발생했습니다: ${msg}` }, { status: 500 });
  }
}