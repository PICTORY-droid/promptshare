import Link from "next/link";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import PageShell from "@/shared/ui/page-shell";

const trustItems = [
  {
    title: "AI 입력 전 위험 점검",
    description:
      "개인정보, 회사기밀, 계약정보, 저작권 원문, 과장 표현을 입력 전에 확인합니다.",
  },
  {
    title: "작성과 검사 분리",
    description:
      "프롬프트 작성과 SafeCheck 검사를 분리해 저장 전 위험을 따로 점검합니다.",
  },
  {
    title: "원문 저장 최소화",
    description:
      "검사 원문 대신 점수, 판정, 위험 카테고리, 안전 문장 안내 중심으로 기록합니다.",
  },
];

export default function HomePage() {
  return (
    <PageShell maxWidth="lg" contentClassName="gap-6 sm:gap-8 lg:gap-10">
      <section className="space-y-5 sm:space-y-6">
        <Badge>PromptLab</Badge>

        <div className="space-y-3 sm:space-y-4">
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            생성형 AI 입력 전,
            <br />
            민감정보와 보안 위험 점검
          </h1>

          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            PromptLab은 프롬프트 작성, SafeCheck 검사, 리포트 관리를 연결한
            AI 입력 보안 점검 워크스페이스입니다.
          </p>
        </div>

        <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <Link href="/safecheck" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">SafeCheck 시작</Button>
          </Link>

          <Link href="/write" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              프롬프트 작성
            </Button>
          </Link>

          <Link href="/reports" className="w-full sm:w-auto">
            <Button variant="ghost" className="w-full sm:w-auto">
              검사 기록 보기
            </Button>
          </Link>
        </div>
      </section>

      <Card>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {trustItems.map((item) => (
              <section key={item.title} className="space-y-1.5">
                <h2 className="text-sm font-semibold text-slate-950">
                  {item.title}
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </section>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}