import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { coverLetter } = await req.json();

    if (!coverLetter || typeof coverLetter !== "string") {
      return NextResponse.json({ error: "자소서 내용을 전달해주세요." }, { status: 400 });
    }

    const prompt = `당신은 대한민국 채용 ATS 전문 분석 AI입니다.

아래 자기소개서를 ATS 4대 기준으로 채점하고 레드플래그를 탐지해주세요.

## 분석 대상 자소서
${coverLetter}

## ATS 4대 채점 기준 (각 25점, 총 100점)
1. 키워드 매칭 - 직무 관련 키워드 포함도
2. 수치화 - 경험의 구체적 수치화 정도
3. 경험 적합도 - 직무와 경험의 연관성
4. 문서 완성도 - 구조, 문법, 가독성

## 레드플래그 8종 탐지
1. AI 전형 표현
2. 수치 없는 경험 서술
3. 직무와 무관한 내용
4. 너무 일반적인 표현
5. 부정적 표현 또는 자기비하
6. 근거 없는 자기자랑
7. 문법/맞춤법 오류
8. 항목별 분량 불균형

## 출력 형식

### 📊 ATS 점수

| 기준 | 점수 | 등급 |
|------|------|------|
| 키워드 매칭 | X/25 | |
| 수치화 | X/25 | |
| 경험 적합도 | X/25 | |
| 문서 완성도 | X/25 | |
| **총점** | **X/100** | **X등급** |

등급 기준: S(95+) / A(85+) / B(70+) / C(55+) / D(54이하)

### 🚩 레드플래그

- **[심각도: high/medium/low]** 항목명
  - 발견 내용: (구체적 문장 인용)
  - 인사담당자 시선: (어떻게 보이는지)
  - 수정 제안: (구체적 개선 방법)

### 💡 종합 피드백

(3~5줄 전체 평가 및 개선 우선순위)`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ result: text });
  } catch (error: unknown) {
    console.error("Fit-analysis API error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: `Claude API 오류: ${message}` }, { status: 500 });
  }
}
