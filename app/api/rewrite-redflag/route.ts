// app/api/rewrite-redflag/route.ts
// OpenRouter 무료 티어 기반 — 비용 0원
// 레드플래그 해당 섹션만 재작성, 나머지 절대 건드리지 않음
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

const TEXT_MODEL = "qwen/qwen2.5-72b-instruct:free";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sectionText,
      sectionName,
      flagType,
      flagDescription,
      flagFix,
    }: {
      sectionText?: string;
      sectionName?: string;
      flagType?: string;
      flagDescription?: string;
      flagFix?: string;
    } = body;

    if (!sectionText || !flagType || !flagFix) {
      return NextResponse.json(
        { error: "필수 파라미터가 없습니다." },
        { status: 400 }
      );
    }

    const prompt = `아래는 자기소개서의 "${sectionName || "해당 항목"}" 섹션입니다.

---원문---
${sectionText.trim()}
---

이 섹션에서 발견된 레드플래그:
- 유형: ${flagType}
- 발견된 내용: ${flagDescription || ""}
- 개선 방법: ${flagFix}

위 레드플래그만 수정해서 섹션을 다시 작성하세요.

규칙:
1. 레드플래그 해당 부분만 수정. 나머지 문장은 절대 바꾸지 말 것.
2. 원문의 전체 흐름, 길이, 구조 유지
3. 원문에 있는 사실(경험, 수치, 회사명, 날짜)은 그대로 유지
4. 없는 내용 추가 금지. 원문에 없는 경험·수치 지어내기 절대 금지
5. 수치가 원문에 없으면 [수치 직접 입력] 표시로 남길 것
6. AI 말투 금지 ("~해왔습니다", "~하고자 합니다" 금지)
7. 수정된 섹션 텍스트만 출력. 설명·머리말·꼬리말 없이 텍스트만.`;

    const response = await client.chat.completions.create({
      model: TEXT_MODEL,
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "응답 형식 오류" }, { status: 500 });
    }

    return NextResponse.json({ rewritten: result.trim() });
  } catch (error: unknown) {
    console.error("Rewrite API error:", error);
    const msg = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json(
      { error: `오류가 발생했습니다: ${msg}` },
      { status: 500 }
    );
  }
}