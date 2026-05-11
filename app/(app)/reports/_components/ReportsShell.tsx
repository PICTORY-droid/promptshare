import Link from "next/link";
import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Badge from "@/shared/ui/badge";
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
        badge="SafeCheck Reports"
        title="SafeCheck 리포트"
        description="로그인한 사용자가 실행한 AI SafeCheck 검사 기록을 확인합니다. 검사 원문은 저장하지 않고, 점수와 판정, 위험 카테고리, 안전 문장 안내만 저장합니다."
        meta={<>로그인 계정: {email}</>}
      />

      <Card className="border-emerald-100 bg-emerald-50">
        <CardHeader className="p-5 sm:p-6">
          <CardTitle className="text-emerald-950">
            원문 미저장 보안 정책
          </CardTitle>
          <CardDescription className="text-emerald-800">
            SafeCheck 리포트는 검사 원문을 보관하지 않고, 필요한 최소 메타데이터만 저장합니다.
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
                <li>상담기록, 진료기록 같은 민감한 원문</li>
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
                <li>정책 버전, 탐지기 버전, 검사 시각</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="전체 리포트"
          description="내 계정에 저장된 검사 기록입니다."
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

      <Card>
        <CardHeader className="p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>리포트 목록</CardTitle>
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
              title="리포트를 불러오지 못했습니다"
              description={reportLoadMessage}
            />
          ) : reports.length === 0 ? (
            <EmptyState
              title="아직 저장된 SafeCheck 리포트가 없습니다"
              description="SafeCheck 화면에서 프롬프트를 검사하면 이곳에 기록됩니다."
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
