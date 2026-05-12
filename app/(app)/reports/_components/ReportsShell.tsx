import Link from "next/link";
import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import StatCard from "@/shared/ui/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import ReportCard from "./ReportCard";

type ReportsShellProps = {
  email: string;
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

export default function ReportsShell({
  email,
  reports,
  reportLoadMessage,
}: ReportsShellProps) {
  const latestReport = reports[0] ?? null;

  return (
    <PageShell>
      <PageHeader
        badge="SafeCheck History"
        title="SafeCheck 검사 기록"
        description="SafeCheck로 검사한 결과를 확인합니다."
        meta={<>로그인 계정: {email}</>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="전체 검사 기록"
          description="내 계정에 저장된 SafeCheck 기록입니다."
          value={reports.length}
        />

        <StatCard
          title="최근 판정"
          description="가장 최근 검사 결과입니다."
          value={getLevelLabel(latestReport?.level)}
        />

        <StatCard
          title="최근 점수"
          description="가장 최근 위험 점수입니다."
          value={latestReport?.score ?? "-"}
        />
      </div>

      <Card className="border-emerald-100 bg-emerald-50">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-emerald-950">
            원문 미저장 기준
          </CardTitle>
          <CardDescription className="text-emerald-800">
            검사 기록은 보여주지만, 검사 원문은 보관하지 않습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <p className="text-sm leading-7 text-emerald-900">
            저장되는 정보는 위험 점수, 판정, 위험 카테고리, 안전 문장 안내, 정책 버전, 탐지기 버전, 검사 시각입니다.
            원문 프롬프트, 고객명, 전화번호, 이메일, 회사기밀, 계약조건 원문은 리포트에 저장하지 않습니다.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>검사 기록 목록</CardTitle>
              <CardDescription>
                최근 검사 기록부터 표시합니다.
              </CardDescription>
            </div>

            <Link href="/safecheck">
              <Button className="w-full sm:w-auto">새 검사 실행</Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          {reportLoadMessage ? (
            <EmptyState
              title="검사 기록을 불러오지 못했습니다"
              description={reportLoadMessage}
            />
          ) : reports.length === 0 ? (
            <EmptyState
              title="SafeCheck 검사 기록 없음."
              description=""
              action={
                <Link href="/safecheck">
                  <Button>첫 검사 실행하기</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:gap-5">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}