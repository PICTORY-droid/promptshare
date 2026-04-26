import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { jobText, resumeText, userInfo } = await req.json();

    if (!jobText) {
      return NextResponse.json(
        { error: "채용공고 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const hasResume = !!resumeText;

    const prompt = `당신은 대한민국 취업 전문 자소서 작성 AI입니다.

## 채용공고
${jobText}

${hasResume ? `## 이력서\n${resumeText}\n` : ""}
${userInfo ? `## 추가 정보\n${userInfo}\n` : ""}

위 정보를 분석하여 자기소개서를 작성해주세요.

## 작성 규칙
### 구조: KKK+STAR 이중 구조
- 결론 → 근거 → 강조 / 상황(Situation) → 과제(Task) → 행동(Action) → 결과(Result)

### 필수 조건
1. 각 항목당 500~700자
2. 경험 서술에 반드시 수치 포함 (기간, 규모, 결과 등)
3. 실패→극복 서사 최소 1개 포함
4. AI 전형 표현 절대 사용 금지:
   ~해왔습니다, ~하고자 합니다, ~할 것입니다, ~이라고 생각합니다,
   열정, 도전, 성장, 혁신, 시너지, 최선, 글로벌, 핵심역량, 소통능력

### 출력 형식
${hasResume ? "## [이력서에서 사용한 정보]\n(이력서에서 추출한 실제 수치와 경험 나열)\n\n" : ""}**[지원동기 및 직무 적합성]**
(내용)

**[핵심 역량 및 경험]**
(내용)

**[성장 과정 및 가치관]**
(내용)

**[입사 후 포부]**
(내용)

---
⚠️ 주의: AI 생성 초안입니다. 수치와 사실관계는 반드시 직접 확인하세요.
${!hasResume ? "\n📝 이력서 미입력 — 경험 부분은 [본인 경험 입력] 빈칸으로 표시했습니다." : ""}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ resume: text });
  } catch (error: unknown) {
    console.error("Resume API error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: `Claude API 오류: ${message}` }, { status: 500 });
  }
}
