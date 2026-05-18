import Link from "next/link";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import PageShell from "@/shared/ui/page-shell";

export default function HomePage() {
  return (
    <PageShell maxWidth="lg" contentClassName="gap-6 sm:gap-8">
      <section className="space-y-5 sm:space-y-6">
        <Badge>PromptLab</Badge>

        <div className="space-y-3">
          <p className="max-w-2xl text-xl font-semibold leading-8 text-slate-950 sm:text-2xl sm:leading-9">
            AI에 입력하기 전, 민감정보와 보안 위험을 먼저 확인하세요.
          </p>

          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            프롬프트 작성, SafeCheck 검사, 기록 관리를 한곳에서 정리합니다.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-950">
              지금 할 수 있는 작업
            </p>
            <p className="text-sm leading-6 text-slate-600">
              저장하거나 공개하기 전, 위험한 입력 내용을 먼저 점검합니다.
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
        </div>
      </section>
    </PageShell>
  );
}