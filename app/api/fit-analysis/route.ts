// app/api/fit-analysis/route.ts
// OpenRouter 무료 티어 기반 — 비용 0원
// 텍스트 모델: qwen/qwen2.5-72b-instruct:free
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
    const { resumeText }: { resumeText?: string } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "자소서/이력서 내용이 너무 짧습니다." },
        { status: 400 }
      );
    }

    const prompt = `당신은 10년 경력의 채용 전문가입니다.
아래 지원서(자소서 + 이력서)를 분석해서 "지원자 입장의 핏 분석 리포트"를 작성하세요.

---
${resumeText.trim()}
---

아래 4개 영역을 각각 0~100점으로 채점하고 피드백을 주세요.

=== 채점 기준 (실제 ATS + HR 담당자 평가 기준) ===

[1. 직무 키워드 매칭 (0~100점)]
- 채용공고/직무에서 요구하는 핵심 기술/역량 키워드가 자소서에 포함됐는가
- 키워드가 자연스럽게 맥락 안에 녹아있는가 (단순 나열 아닌지)
- 직무 관련 없는 키워드 남발은 감점

[2. 경험 수치화 (0~100점)]
- 성과/경험에 구체적인 수치가 있는가 (기간, 규모, 결과 퍼센트 등)
- "[수치 직접 입력]" 같은 빈칸이 남아있으면 대폭 감점
- 수치 없이 "열심히 했습니다", "성과를 냈습니다" 수준이면 낮은 점수

[3. 직무 경험 적합도 (0~100점)]
- 자소서에 서술된 경험이 지원 직무와 얼마나 연관되는가
- 관련 없는 경험 위주로 서술됐으면 낮은 점수
- 전공/인턴/프로젝트/자격증이 직무와 연결됐는가

[4. 문서 완성도 (0~100점)]
- 각 항목(지원동기/성장과정/직무역량/포부)이 고르게 작성됐는가
- 두괄식 구성인가 (결론 먼저)
- AI가 쓴 것 같은 전형적 표현 비율 (높으면 감점)
- 빈칸/[본인 경험 입력] 같은 미완성 항목 존재 여부

=== 레드플래그 탐지 기준 (실제 HR 담당자가 주의 깊게 보는 항목) ===

아래 항목을 자소서에서 탐지하세요. 발견된 것만 출력하세요.

1. 수치 없는 성과 나열 — "성과를 냈습니다", "기여했습니다" 처럼 수치 없이 결과만 주장
2. AI 전형 문체 — "~해왔습니다", "~하고자 합니다", "성장하는 인재가 되겠습니다" 반복
3. 직무 무관 경험 강조 — 지원 직무와 관련 없는 경험을 지나치게 많이 서술
4. 과도한 자기 칭찬 — 구체적 근거 없이 "최고", "탁월", "누구보다" 류 표현
5. 추상적 포부 — "열심히 하겠습니다", "최선을 다하겠습니다" 수준의 포부
6. 미완성 항목 — [본인 경험 입력], [수치 직접 입력] 등 빈칸 그대로 존재
7. 앞뒤 불일치 — 자소서 내에서 경력/날짜/역할이 서로 모순되거나 불일치
8. 지나치게 짧은 항목 — 한 항목이 100자 미만으로 성의 없어 보임

=== 강점 탐지 ===
인사담당자가 긍정적으로 볼 요소들을 찾아서 나열하세요.

=== 출력 형식 (JSON만 출력, 다른 텍스트 절대 금지) ===

{
  "totalScore": 전체 평균 점수 (0~100 정수),
  "grade": "S/A/B/C/D 중 하나 (90+: S, 80+: A, 70+: B, 60+: C, 60미만: D)",
  "gradeLabel": "등급 한 줄 설명 (예: '합격 가능성 높음', '보완 후 재지원 권장')",
  "categories": [
    {
      "name": "직무 키워드 매칭",
      "score": 점수(0~100),
      "feedback": "2~3줄 구체적 피드백. 자소서 근거만 사용.",
      "improve": "개선 방법 1줄"
    },
    {
      "name": "경험 수치화",
      "score": 점수(0~100),
      "feedback": "2~3줄 구체적 피드백",
      "improve": "개선 방법 1줄"
    },
    {
      "name": "직무 경험 적합도",
      "score": 점수(0~100),
      "feedback": "2~3줄 구체적 피드백",
      "improve": "개선 방법 1줄"
    },
    {
      "name": "문서 완성도",
      "score": 점수(0~100),
      "feedback": "2~3줄 구체적 피드백",
      "improve": "개선 방법 1줄"
    }
  ],
  "redFlags": [
    {
      "type": "레드플래그 유형명",
      "severity": "high/medium/low",
      "description": "자소서에서 발견된 구체적 내용 (실제 문장 인용 또는 위치 명시)",
      "hrPerspective": "인사담당자 입장에서 왜 문제인지 1줄",
      "fix": "수정 방법 1줄"
    }
  ],
  "strengths": [
    {
      "type": "강점 유형명",
      "description": "자소서에서 발견된 구체적 강점",
      "hrPerspective": "인사담당자가 어떻게 볼지 1줄"
    }
  ],
  "summary": "전체 총평 3~4줄. 자소서 근거만 사용. AI 말투 금지."
}`;

    const response = await client.chat.completions.create({
      model: TEXT_MODEL,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "응답 형식 오류" }, { status: 500 });
    }

    let parsed;
    try {
      const clean = result.replace(/```json|```/g, "").trim();
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON not found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Parse error:", e);
      return NextResponse.json(
        { error: "응답 파싱 오류. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Fit analysis API error:", error);
    const msg = error instanceof Error ? error.message : "서버 오류";
    return NextResponse.json(
      { error: `오류가 발생했습니다: ${msg}` },
      { status: 500 }
    );
  }
}