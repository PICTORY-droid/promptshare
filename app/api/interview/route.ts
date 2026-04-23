// app/api/interview/route.ts
// OpenRouter 무료 티어 기반 — 비용 0원
// STEP1: Vision 모델로 채용공고 이미지 분석
// STEP2: 텍스트 모델로 면접 질문 생성
// 웹서치는 OpenRouter 무료 모델 미지원 → 채용공고 원문 텍스트 기반으로 대체
// ANTHROPIC_API_KEY는 Claude Code 자동화 전용 — 이 파일에서 사용 안 함

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

const VISION_MODEL = "qwen/qwen2.5-vl-72b-instruct:free";
const TEXT_MODEL = "qwen/qwen2.5-72b-instruct:free";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// ─────────────────────────────────────────────
// STEP 1: 채용공고 이미지 → 회사명 + 직무 + 원문 추출
// ─────────────────────────────────────────────
async function extractJobInfo(
  imageBase64: string,
  mediaType: string
): Promise<{ company: string; jobTitle: string; rawText: string }> {
  const response = await client.chat.completions.create({
    model: VISION_MODEL,
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${mediaType};base64,${imageBase64}` },
          },
          {
            type: "text",
            text: `이 채용공고 이미지에서 아래 정보를 추출하세요.
이미지에 실제로 적힌 내용만 추출하세요. 없으면 "알 수 없음"으로 표시.

JSON만 출력하세요. 다른 텍스트 금지.

{
  "company": "회사명",
  "jobTitle": "직무명 (예: 프론트엔드 개발자, 마케터 등)",
  "rawText": "채용공고에서 읽을 수 있는 주요 텍스트 전체 (담당업무, 자격요건, 우대사항 포함)"
}`,
          },
        ],
      },
    ],
  });

  const text = response.choices[0]?.message?.content || "";
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("no json");
    return JSON.parse(jsonMatch[0]);
  } catch {
    return { company: "알 수 없음", jobTitle: "알 수 없음", rawText: text };
  }
}

// ─────────────────────────────────────────────
// STEP 2: 채용공고 원문 + 자소서 → 면접 질문 생성
// ─────────────────────────────────────────────
async function generateQuestions(
  company: string,
  jobTitle: string,
  jobRawText: string,
  resumeText: string
): Promise<string> {
  const prompt = `당신은 10년 경력의 채용 면접관입니다.

아래 정보를 모두 활용해 면접 질문 8개를 만드세요.

[채용공고 정보]
회사: ${company}
직무: ${jobTitle}
${jobRawText ? `채용공고 내용:\n${jobRawText}` : ""}

[지원자 자소서]
${resumeText.trim()}

--- 2026년 면접 트렌드 기반 규칙 ---

[질문 구성 — 4가지 유형, 각 2개씩]
1. 자소서 기반 꼬리질문 — 자소서에 실제로 쓴 내용만 근거로 질문. 없는 내용으로 질문 금지
2. 직무·회사 적합성 — 채용공고 직무 요건과 지원자 경험 연결 검증
3. 인성·협업 — 갈등, 실패, 팀워크 경험
4. AI·변화 적응력 — 2026 필수. AI 도구 활용, 빠른 변화 대응 경험

[답변 작성 규칙]
- 자소서에 실제로 있는 내용만 사용. 없는 수치·경험 지어내기 절대 금지
- 이력서에 수치 없으면 [수치 직접 입력] 표시로 남길 것
- STAR 구조로 150~200자, 말하듯 자연스럽게
- "~드리겠습니다", "~하고자 합니다" 같은 AI 말투 금지
- 짧고 강한 문장으로

출력 형식 (JSON만, 다른 텍스트 금지):

{
  "company": "${company}",
  "jobTitle": "${jobTitle}",
  "companyInfo": "채용공고에서 파악한 회사/직무 핵심 정보 1~2줄",
  "searchedAt": "채용공고 원문 기반 분석",
  "questions": [
    {
      "type": "자소서 기반 꼬리질문",
      "question": "질문 내용",
      "basis": "자소서의 어느 부분을 근거로 한 질문인지 한 줄 설명",
      "answer": "모범답변 (STAR, 150~200자, 자소서 근거만)",
      "tailQuestion": "예상 꼬리질문 1개"
    }
  ]
}`;

  const response = await client.chat.completions.create({
    model: TEXT_MODEL,
    max_tokens: 5000,
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0]?.message?.content || "";
}

// ─────────────────────────────────────────────
// 메인 핸들러
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      resumeText,
      jobImageBase64,
      jobMediaType,
    }: {
      resumeText?: string;
      jobImageBase64?: string;
      jobMediaType?: string;
    } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "자소서 내용이 너무 짧습니다." },
        { status: 400 }
      );
    }

    let company = "알 수 없음";
    let jobTitle = "알 수 없음";
    let jobRawText = "";

    if (
      jobImageBase64 &&
      jobMediaType &&
      ALLOWED_TYPES.includes(jobMediaType)
    ) {
      try {
        const extracted = await extractJobInfo(jobImageBase64, jobMediaType);
        company = extracted.company;
        jobTitle = extracted.jobTitle;
        jobRawText = extracted.rawText;
      } catch (e) {
        console.error("Image extraction error:", e);
      }
    }

    const rawResult = await generateQuestions(
      company,
      jobTitle,
      jobRawText,
      resumeText
    );

    let parsed;
    try {
      const clean = rawResult.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON not found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Parse error:", e, "\nRaw:", rawResult.slice(0, 300));
      return NextResponse.json(
        { error: "응답 파싱 오류. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Interview API error:", error);
    const msg = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json(
      { error: `오류가 발생했습니다: ${msg}` },
      { status: 500 }
    );
  }
}