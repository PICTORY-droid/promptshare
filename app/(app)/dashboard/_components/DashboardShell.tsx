import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import StatCard from "@/shared/ui/stat-card";
import Badge from "@/shared/ui/badge";
import DashboardPromptCard from "./DashboardPromptCard";

type DashboardShellProps = {
  email: string;
  prompts: Prompt[];
  promptLoadMessage: string | null;
  reports: SafeCheckReport[];
  reportLoadMessage: string | null;
};

function getLevelLabel(level: string | undefined) {
  if (level === "block") {
    return "차단";
  }

  if (level === "review") {
    return "검토 필요";
  }

  if (level === "allow") {
    return "허용";
  }

  return "-";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardShell({
  email,
  prompts,
  promptLoadMessage,
  reports,
  reportLoadMessage,
}: DashboardShellProps) {
  const latestReport = reports[0] ?? null;
  const recentReports = reports.slice(0, 3);

  return (
    <PageShell>
      <PageHeader
        badge="개인 메뉴"
        title="PromptLab 대시보드"
        description="내 프롬프트와 최근 SafeCheck 검사 기록을 확인합니다"
        meta={<>로그인 계정: {email}</>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="로그인 계정"
          description="현재 접속 중인 계정입니다"
          value={<span className="block break-all text-base">{email}</span>}
        />

        <StatCard
          title="내 프롬프트"
          description="현재 저장된 프롬프트 개수입니다"
          value={prompts.length}
          helperText="초안, 게시, 보관 상태를 포함합니다"
        />

        <StatCard
          title="최근 SafeCheck"
          description="가장 최근 검사 결과입니다"
          value={getLevelLabel(latestReport?.level)}
          helperText={
            latestReport
              ? `위험 점수 ${latestReport.score}`
              : "SafeCheck 기록 없음"
          }
        />
      </div>

      <Card>
        <CardHeader className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>최근 SafeCheck 검사 기록</CardTitle>
              <CardDescription>
                SafeCheck로 검사한 최근 결과
                <br />
                검사 원문은 저장하지 않습니다
              </CardDescription>
            </div>

            <Link href="/reports">
              <Button variant="secondary" className="w-full sm:w-auto">
                전체 검사 기록 보기
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          {reportLoadMessage ? (
            <EmptyState
              title="검사 기록을 불러오지 못했습니다"
              description={reportLoadMessage}
            />
          ) : recentReports.length === 0 ? (
            <EmptyState
              title="SafeCheck 기록 없음"
              description=""
              action={
                <Link href="/safecheck">
                  <Button>SafeCheck 실행하기</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{getLevelLabel(report.level)}</Badge>
                    <Badge>점수 {report.score}</Badge>
                    {report.riskCategories.length === 0 ? (
                      <Badge>위험 없음</Badge>
                    ) : (
                      report.riskCategories.slice(0, 3).map((category) => (
                        <Badge key={category}>{category}</Badge>
                      ))
                    )}
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-950">
                    {formatDate(report.createdAt)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                    {report.safePrompt || "저장된 안전 문장 안내가 없습니다"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>내 프롬프트 목록</CardTitle>
              <CardDescription>
                프롬프트 확인, 수정, 보관, 복구
              </CardDescription>
            </div>

            <Link href="/write">
              <Button className="w-full sm:w-auto">새 프롬프트 작성</Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          {promptLoadMessage ? (
            <EmptyState
              title="내 프롬프트를 불러오지 못했습니다"
              description={promptLoadMessage}
            />
          ) : prompts.length === 0 ? (
            <EmptyState
              title="아직 저장한 프롬프트가 없습니다"
              description="프롬프트 작성 화면에서 첫 프롬프트를 저장하세요"
              action={
                <Link href="/write">
                  <Button>첫 프롬프트 작성하기</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {prompts.map((prompt) => (
                <DashboardPromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}