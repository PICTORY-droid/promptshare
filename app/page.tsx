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

const workflowItems = [
  "프롬프트 작성",
  "저장 전 AI SafeCheck 검사",
  "비공개 초안으로 안전하게",
  "검토 후 공개 게시 전환",
  "SafeCheck 리포트 확인",
];

const featureCards = [
  {
    title: "프롬프트 작성과 관리",
    description:
      "목적별 프롬프트를 작성하고 내 대시보드에서 관리",
  },
  {
    title: "AI SafeCheck",
    description:
      "개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 저장 전 검사",
  },
  {
    title: "공개와 비공개 관리",
    description:
      "비공개 초안으로 저장,\n검토 후 프롬프트만 공개 게시합니다",
  },
  {
    title: "리포트와 원문 미저장",
    description:
      "검사 원문 미저장. 점수, 판정, 위험 카테고리, 안전 문장 안내만 리포트로 보관",
  },
];

const privatePublicRules = [
  {
    title: "개인 작업용",
    state: "비공개 + 초안",
    description:
      "본인 대시보드에서만 볼 수 있습니다. 테스트 중인 프롬프트나 공개 전 검토용 프롬프트에 적합합니다",
  },
  {
    title: "공개 프롬프트",
    state: "공개 + 게시",
    description:
      "다른 사용자도 공개 프롬프트 목록에서 볼 수 있습니다. SafeCheck 검토 후 공개하는 것을 권장합니다",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8 lg:gap-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5 sm:space-y-6">
            <Badge>PromptLab v3</Badge>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl lg:text-6xl">
                프롬프트 작성, 저장,
                <br />
                안전한 공개 AI 작업실
              </h1>

              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                PromptLab은 작성, 개인 보관, 공개 게시,
                <br className="hidden sm:block" />
                AI SafeCheck, 리포트 관리를 연결한 작업 공간입니다
              </p>
            </div>

            <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <Link href="/write">
                <Button className="w-full sm:w-auto">프롬프트 작성하기</Button>
              </Link>
              <Link href="/safecheck">
                <Button variant="secondary" className="w-full sm:w-auto">
                  AI SafeCheck 열기
                </Button>
              </Link>
              <Link href="/prompts">
                <Button variant="ghost" className="w-full sm:w-auto">
                  공개 프롬프트 보기
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardHeader className="p-5 sm:p-6">
              <CardTitle>AI SafeCheck inside</CardTitle>
              <CardDescription>
                공개, 저장 전, 위험한 프롬프트 점검
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-2 sm:space-y-3">
                {workflowItems.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold leading-5 text-slate-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="p-5 sm:p-6">
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="whitespace-pre-line">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle>개인 보관과 공개 게시를 분리</CardTitle>
            <CardDescription>
              테스트 프롬프트가 바로 공개되지 않도록 비공개와 초안 중심으로 운영
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              {privatePublicRules.map((rule) => (
                <div
                  key={rule.state}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                >
                  <Badge>{rule.state}</Badge>
                  <h2 className="mt-4 text-base font-bold text-slate-950 sm:text-lg">
                    {rule.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-emerald-50">
          <CardHeader className="p-5 sm:p-6">
            <CardTitle className="text-emerald-950">
              검사 원문은 저장하지 않습니다
            </CardTitle>
            <CardDescription className="text-emerald-800">
              SafeCheck 리포트에는 원문 프롬프트, 고객명, 전화번호, 이메일, 회사기밀 원문을 저장하지 않습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-sm font-semibold text-emerald-950">
                  저장하지 않는 데이터
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-800">
                  <li>검사 원문 프롬프트</li>
                  <li>고객명, 전화번호, 이메일 원문</li>
                  <li>회사기밀, 내부자료, 계약조건 원문</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white/70 p-4">
                <p className="text-sm font-semibold text-emerald-950">
                  저장하는 데이터
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-800">
                  <li>위험 점수와 판정</li>
                  <li>위험 카테고리</li>
                  <li>안전 문장 안내</li>
                  <li>정책 버전과 검사 시각</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}