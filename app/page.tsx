import Link from "next/link";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import PageShell from "@/shared/ui/page-shell";

export default function HomePage() {
  return (
    <PageShell maxWidth="lg" contentClassName="gap-6 sm:gap-8">
      <section className="space-y-5 sm:space-y-6">
        <Badge>PromptLab</Badge>

        <div className="space-y-2">
          <p className="max-w-2xl text-base font-semibold leading-7 text-slate-950 sm:text-lg sm:leading-8">
            AI 입력 전 보안 점검 워크스페이스
          </p>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            생성형 AI에 입력 전, 민감정보와 업무 보안 위험 확인
          </p>
        </div>
      </section>

      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-950">
                오늘의 기본 작업
              </p>
              <p className="text-sm leading-6 text-slate-600">
                SafeCheck로 입력 위험 확인/, 필요 기록 저장
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold leading-5 text-slate-600">
                원문 저장 최소화 · 위험 카테고리 기록 · 안전 문장 안내
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
        </CardContent>
      </Card>
    </PageShell>
  );
}