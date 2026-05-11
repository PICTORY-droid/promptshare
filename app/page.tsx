import Link from "next/link";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const featureCards = [
  {
    title: "프롬프트 작성",
    description:
      "업무, 글쓰기, 마케팅, 음악 생성 등 목적별 프롬프트를 구조화해 작성합니다.",
  },
  {
    title: "AI SafeCheck",
    description:
      "저장 전 개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 검사합니다.",
  },
  {
    title: "Supabase Auth/CRUD",
    description:
      "로그인한 사용자가 프롬프트를 저장, 조회, 수정, 관리할 수 있는 구조로 확장합니다.",
  },
];

const workflowItems = [
  "프롬프트 작성",
  "AI SafeCheck 검사",
  "위험 점수와 판정 확인",
  "안전 문장으로 수정",
  "PromptLab에 저장",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge>PromptLab v3</Badge>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                프롬프트를 만들고, 저장하고, 안전하게 검증하는 AI 작업실
              </h1>

              <p className="max-w-2xl text-base leading-8 text-slate-600">
                PromptLab v3는 기존 프롬프트 공유 구조를 재구축해, 고품질
                프롬프트 작성과 AI SafeCheck 기반 안전 검사를 하나로 통합하는
                웹 서비스입니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/write">
                <Button>프롬프트 작성하기</Button>
              </Link>
              <Link href="/safecheck">
                <Button variant="secondary">AI SafeCheck 열기</Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost">로그인</Button>
              </Link>
            </div>
          </div>

          <Card className="bg-slate-950 text-white">
            <CardHeader>
              <CardTitle className="text-white">AI SafeCheck inside</CardTitle>
              <CardDescription className="text-slate-300">
                PromptLab에 저장하기 전, 위험한 프롬프트를 먼저 점검합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflowItems.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-100">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>v3 재구축 기준</CardTitle>
            <CardDescription>
              기존 로딩 이슈를 계속 수리하지 않고, 안정적인 구조로 다시
              설계합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-950">
                  유지하는 것
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>PromptLab 브랜드</li>
                  <li>promptlab.io.kr 운영 도메인</li>
                  <li>GitHub, Vercel, Supabase 기반</li>
                  <li>AI SafeCheck 검사 엔진 통합 방향</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-950">
                  새로 정리하는 것
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  <li>기존 900여 개 저품질 프롬프트 핵심 데이터 제외</li>
                  <li>컴포넌트, 서버 로직, DB 접근 분리</li>
                  <li>Supabase Auth와 CRUD 실제 구현</li>
                  <li>저장 전 SafeCheck 검사 흐름 구현</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}