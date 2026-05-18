import Link from "next/link";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
} from "@/shared/ui/card";

const trustItems = [
  {
    title: "AI 입력 전 위험 점검",
    description:
      "개인정보, 회사기밀, 계약정보, 저작권 원문, 과장 표현을 입력 전에 확인합니다.",
  },
  {
    title: "작성과 검사 분리",
    description:
      "프롬프트는 작성하고, SafeCheck는 저장 또는 공개 전에 따로 점검합니다.",
  },
  {
    title: "원문 저장 최소화",
    description:
      "검사 원문 대신 점수, 판정, 위험 카테고리, 안전 문장 안내 중심으로 기록합니다.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <section className="mx-auto flex max-w-5xl flex-col gap-6 sm:gap-8">
        <div className="space-y-5 sm:space-y-6">
          <Badge>PromptLab</Badge>

          <div className="space-y-3 sm:space-y-4">
            <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-6xl">
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
            <Link href="/safecheck">
              <Button className="w-full sm:w-auto">SafeCheck 시작</Button>
            </Link>
            <Link href="/write">
              <Button variant="secondary" className="w-full sm:w-auto">
                프롬프트 작성
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost" className="w-full sm:w-auto">
                검사 기록 보기
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-3">
              {trustItems.map((item) => (
                <section key={item.title} className="space-y-1.5">
                  <h2 className="text-sm font-bold text-slate-950">
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
      </section>
    </main>
  );
}