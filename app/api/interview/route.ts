import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const jobImage = formData.get("jobImage") as File | null;
    const coverLetter = (formData.get("coverLetter") as string) || "";

    if (!jobImage) {
      return NextResponse.json({ error: "채용공고 이미지를 업로드해주세요." }, { status: 400 });
    }

    const buffer = await jobImage.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mediaType = jobImage.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif";

    const extractResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: '이 채용공고 이미지에서 회사명과 직무명만 JSON으로 추출해주세요.\n형식: {"company": "회사명", "position": "직무명"}\n다른 설명 없이 JSON만 출력하세요.' },
        ],
      }],
    });

    let company = "지원 회사";
    let position = "지원 직무";

    try {
      const extractText = extractResponse.content[0].type === "text" ? extractResponse.content[0].text.trim() : "{}";
      const parsed = JSON.parse(extractText);
      company = parsed.company || company;
      position = parsed.position || position;
    } catch { }

    const interviewResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          {
            type: "text",
            text: `회사명: ${company}
직무: ${position}
${coverLetter ? `\n자기소개서:\n${coverLetter}` : ""}

위 채용공고를 바탕으로 면접 질문 8개를 생성하세요.

## 질문 유형 (각 2개씩)
- 자소서 기반 질문
- 직무 적합 질문 (${position} 역량 검증)
- 인성·협업 질문
- AI 역량 질문

## 출력 형식

### Q1. [질문 유형] 질문 내용

**근거:** 이 질문을 하는 이유
**꼬리질문:** 예상 꼬리질문 1~2개
**모범답변 방향:** 어떻게 답하면 좋은지 (3~5줄)

---
(Q2~Q8 동일 형식)`
          },
        ],
      }],
    });

    const text = interviewResponse.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("\n");

    return NextResponse.json({ result: text, company, position });
  } catch (error: unknown) {
    console.error("Interview API error:", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json({ error: `Claude API 오류: ${message}` }, { status: 500 });
  }
}
