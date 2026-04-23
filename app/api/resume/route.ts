// app/api/resume/route.ts
// OpenRouter 무료 티어 기반 — 비용 0원
// Vision 모델: qwen/qwen2.5-vl-72b-instruct:free
// ANTHROPIC_API_KEY는 Claude Code 자동화 전용 — 이 파일에서 사용 안 함

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenRouter 클라이언트 — OPENROUTER_API_KEY 사용
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://promptlab.io.kr",
    "X-Title": "PromptLab",
  },
});

const VISION_MODEL = "qwen/qwen2.5-vl-72b-instruct:free";

interface ImageInput {
  base64: string;
  mediaType: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobImageBase64,
      jobMediaType,
      resumeImages,
      userInfo,
    }: {
      jobImageBase64?: string;
      jobMediaType?: string;
      resumeImages?: ImageInput[];
      userInfo?: string;
    } = body;

    if (!jobImageBase64 || !jobMediaType) {
      return NextResponse.json(
        { error: "채용공고 이미지가 없습니다." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(jobMediaType)) {
      return NextResponse.json(
        { error: "지원하지 않는 이미지 형식입니다. (jpg, png, webp 가능)" },
        { status: 400 }
      );
    }

    const validResumeImages: ImageInput[] = [];
    if (resumeImages && Array.isArray(resumeImages)) {
      for (const img of resumeImages.slice(0, 3)) {
        if (img.base64 && img.mediaType && ALLOWED_TYPES.includes(img.mediaType)) {
          validResumeImages.push(img);
        }
      }
    }

    const hasResume = validResumeImages.length > 0;

    // OpenAI 호환 형식으로 이미지 구성
    const imageContents: OpenAI.Chat.ChatCompletionContentPart[] = [];

    imageContents.push({
      type: "image_url",
      image_url: { url: `data:${jobMediaType};base64,${jobImageBase64}` },
    });

    for (const img of validResumeImages) {
      imageContents.push({
        type: "image_url",
        image_url: { url: `data:${img.mediaType};base64,${img.base64}` },
      });
    }

    const resumeSection = hasResume
      ? `두 번째 이미지${validResumeImages.length > 1 ? `부터 ${validResumeImages.length + 1}번째 이미지까지` : ""}는 지원자의 이력서입니다 (${validResumeImages.length}장으로 분할 캡처됨). 모든 이력서 이미지를 합쳐서 학력, 경력, 프로젝트, 자격증, 기술 스택 등 정보를 빠짐없이 추출하여 자소서에 반영하세요.`
      : `이력서가 제공되지 않아 일반적인 신입 지원자 기준으로 작성합니다.`;

    const userInfoSection = userInfo?.trim()
      ? `\n추가 정보:\n${userInfo.trim()}`
      : "";

    const prompt = `당신은 10년 경력의 취업 컨설턴트입니다.

첫 번째 이미지는 채용공고입니다. ${resumeSection}${userInfoSection}

아래 규칙을 반드시 지켜 자기소개서를 작성하세요.

--- 2026년 합격 자소서 작성 규칙 ---

[문체 규칙 — 가장 중요]
- AI가 쓴 것처럼 매끄럽고 완벽한 문장 절대 금지
- 짧은 문장(10자 내외)과 긴 문장(40자 이상)을 의도적으로 번갈아 쓸 것
- "~해왔습니다", "~하고자 합니다", "~를 통해 성장했습니다" 같은 전형적 AI 마무리 표현 금지
- 실패했던 경험, 막혔던 순간을 최소 1개 이상 포함할 것
- 감정 표현은 구체적으로. "힘들었습니다" 대신 "이틀을 날렸습니다" 수준으로

[문단 구조 규칙 — KKK + STAR]
각 항목을 아래 순서로 구성하세요:
1. 결론 먼저 (두괄식) — 첫 문장에서 핵심 역량이나 경험을 한 문장으로 바로 제시
2. 근거 (STAR 구조로 서술)
   - Situation: 상황 설명 (2~3문장 이내로 제한)
   - Task: 내가 맡은 과제나 역할
   - Action: 내가 실제로 한 행동 (가장 구체적으로, 분량의 절반 이상)
   - Result: 수치나 지표로 된 결과 (기간, 규모, 성과 포함)
3. 강조 — 이 경험이 지원 직무와 어떻게 연결되는지 1~2문장으로 마무리

[항목별 전략]
- 지원 동기: "이 회사가 대단해서"가 아니라 "내 경험이 이 직무와 왜 맞는지"로 작성
- 성장 과정: 실패 또는 시행착오 경험 반드시 포함. 극복 과정의 행동이 핵심
- 직무 역량: 채용공고 키워드를 Action과 Result에 자연스럽게 녹일 것
- 입사 후 포부: 막연한 다짐 금지. 입사 1년 차 목표 → 3~5년 성장 방향 순으로 단계별 구체화

[내용 규칙 — 환각 방지]
- 이력서가 제공된 경우: 이력서에 실제로 적힌 내용만 사용. 이미지에 없는 수치·경험·회사명·프로젝트명 절대 지어내기 금지
- 이력서가 없는 경우: 경험·수치가 들어가야 할 자리에 [본인 경험 입력] 형태의 빈칸으로 출력. 절대로 임의로 채우지 말 것
- 수치가 이력서에 없으면 수치 대신 [구체적 수치 입력]으로 표시
- 직무와 관련 높은 경험 1~2개만 집중. 나열 금지

[형식 규칙]
- 각 항목 500~700자
- 문단 나누지 말고 흐름이 이어지는 한 덩어리로 작성
- 소제목, 불릿포인트 사용 금지 (자소서 본문 안에서)

출력 형식 (아래 형식 그대로, 순서 변경 금지):

[채용공고 분석]
- 회사명: 
- 직무: 
- 핵심 요구 역량 3가지: 

[이력서 미제공 — 아래 빈칸을 직접 채워주세요]
- 주요 경력/프로젝트: [직접 입력]
- 보유 기술: [직접 입력]
- 관련 수치/성과: [직접 입력]

[자기소개서]

1. 지원 동기
(내용)

2. 성장 과정
(내용)

3. 직무 역량
(내용)

4. 입사 후 포부
(내용)`;

    const response = await client.chat.completions.create({
      model: VISION_MODEL,
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            ...imageContents,
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "응답 형식 오류" }, { status: 500 });
    }

    return NextResponse.json({
      resume: result,
      resumeImagesUsed: validResumeImages.length,
    });
  } catch (error: unknown) {
    console.error("Resume API error:", error);
    const msg = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json(
      { error: `오류가 발생했습니다: ${msg}` },
      { status: 500 }
    );
  }
}