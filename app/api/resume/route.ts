// app/api/resume/route.ts
// Groq 무료 티어 기반 — 비용 0원

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const TEXT_MODELS = [
  "qwen-qwq-32b",
  "llama-3.3-70b-versatile",
  "llama3-70b-8192",
];

async function callWithFallback(messages: { role: "system" | "user" | "assistant"; content: string }[]): Promise<string> {
  let lastError: Error | null = null;

  for (const model of TEXT_MODELS) {
    try {
      console.log(`[Resume] 모델 시도: ${model}`);
      const response = await client.chat.completions.create({
        model,
        max_tokens: 6000,
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
    .replace(/[\u3040-\u309f\u30a0-\u30ff]/g, "")
    .trim();
}

const SYSTEM_PROMPT = `당신은 삼성전자·구글 출신 10년 경력 한국 채용 전문가입니다.
반드시 순수한 한국어로만 작성하세요. 영어 단어, 중국어, 일본어 문자를 절대 사용하지 마세요.

아래는 당신이 작성해야 할 자기소개서의 문체 기준입니다. 이 예시들의 문장 리듬, 구체성, 서술 방식을 그대로 모방하세요.

===== 좋은 자소서 문단 예시 =====

[예시 1 — 지원 동기]
마감 이틀 전이었다. 신청자 수가 목표치의 30%에 머물렀고, 팀장은 이미 포기한 표정이었다. 나는 그날 밤 홍보 방식 자체를 바꿨다. 기존에 쓰던 문자 발송 대신 지역 맘카페 운영자 90곳에 직접 메시지를 보냈다. 짧고 구체적인 혜택 안내, 신청 링크 하나. 다음날 오전에만 47건이 접수됐다. 그 경험으로 알게 됐다. 같은 정보라도 어떤 경로로 어떻게 전달하느냐가 결과를 완전히 바꾼다는 것을. 숭실원격평생교육원의 학사설계팀이 하는 일이 정확히 그것이다. 수강생의 상황을 읽고, 그에 맞는 언어로 접근해서, 학습을 이어가도록 설계하는 일. 내가 현장에서 몸으로 익힌 방식과 일치한다.

[예시 2 — 성장 과정]
처음 3주는 완전히 틀렸다. 홍보물을 만들어 배포했는데 반응이 없었다. 문구가 문제인지, 타깃이 문제인지 몰랐다. 그냥 더 많이 뿌리면 된다고 생각했다. 아니었다. 수강 대상자 연령층과 내가 올린 플랫폼이 전혀 맞지 않았다. 40대 이상 직장인을 대상으로 하는 교육인데 인스타그램에 올리고 있었던 것이다. 타깃을 바꾸고 채널을 바꿨다. 지역 커뮤니티, 직장인 카페, 문자 안내로 전환했더니 2주 만에 문의가 들어오기 시작했다. 실패한 3주가 없었다면 그 전환도 없었다. 잘못된 방향을 빠르게 인식하고 수정하는 것, 그게 내가 현장에서 배운 유일하게 확실한 방법이다.

[예시 3 — 직무 역량]
수료율 관리가 숫자만의 문제가 아니라는 걸 알게 된 건 한 수강생의 전화 한 통 때문이었다. 진도가 멈춰있어서 연락을 드렸더니, 야간 근무 중이라 수강 시간이 없다고 했다. 수료 기한을 확인하고, 가능한 구간을 찾아서 짧은 단위로 나눈 학습 일정을 문자로 드렸다. 일주일 뒤 수료했다. 그 이후 나는 진도 미달 수강생에게 연락할 때 항상 상황부터 물었다. 구글 스프레드시트로 수강생별 진도율과 최종 연락 일자를 관리했고, 주 1회 현황을 팀장에게 보고했다. 개인적인 친절이 아니라 관리 체계가 수료율을 올린다.

[예시 4 — 입사 후 포부]
입사 첫 달은 기존 수강생 데이터를 분석하는 데 쓸 것이다. 수료율이 낮은 구간이 어디인지, 중도 포기 사유가 어떤 패턴으로 반복되는지 파악해야 한다. 그걸 모르면 상담이 감으로 하는 일이 된다. 6개월 안에 담당 수강생의 수료율을 현재보다 15% 이상 높이는 것을 첫 번째 기준으로 삼겠다. 3년 차에는 신규 수강생 유입 경로별 전환율 데이터를 직접 구축하고 싶다. 어떤 채널에서 온 수강생이 끝까지 수료하는지, 그 데이터가 쌓이면 홍보 방식도 상담 방식도 달라진다. 감이 아니라 근거로 움직이는 팀을 만드는 데 보태고 싶다.

===== 예시 끝 =====

위 예시들의 공통점:
1. 첫 문장이 숫자 또는 구체적 장면으로 시작한다
2. 짧은 문장과 긴 문장이 불규칙하게 섞인다
3. 실패·시행착오 경험이 포함된다
4. "열정", "노력", "기여", "최선", "역량을 키웠습니다" 같은 표현이 없다
5. 마지막 문장이 다짐이 아니라 사실·계획·관찰로 끝난다
6. 회사 칭찬이 없다
7. 각 항목이 500자 이상이다
8. 영어 단어, 외국어 문자가 없다`;

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

    const userPrompt = `아래 채용공고와 이력서를 보고 자기소개서를 작성하세요.

[채용공고]
${jobText}

${resumeSection}${userInfoSection}

작성 규칙:
1. 위에서 보여준 예시 문단들의 문체와 구조를 그대로 따르세요
2. 이력서에 있는 실제 경험과 수치만 사용하세요. 없는 내용 생성 금지
3. 이력서에 없는 수치·경험은 [본인 경험 입력]으로 표시
4. 각 항목 최소 500자, 전체 최소 2000자
5. 영어 단어, 외국어 문자 완전 금지
6. ** * _ # 기호 출력 금지
7. 소제목, 불릿포인트 금지
8. 순수 한국어로만 작성

출력 형식 (순서 변경 금지):

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
(500자 이상)

2. 성장 과정
(500자 이상, 실패 경험 포함)

3. 직무 역량
(500자 이상, 수치 근거 포함)

4. 입사 후 포부
(500자 이상, 구체적 수치 목표 포함)`;

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
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