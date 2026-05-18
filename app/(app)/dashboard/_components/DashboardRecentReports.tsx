import Link from "next/link";
import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import EmptyState from "@/shared/ui/empty-state";

type DashboardRecentReportsProps = {
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
  return new Date(value).toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
}

export default function DashboardRecentReports({
  reports,
  reportLoadMessage,
}: DashboardRecentReportsProps) {
  return (
    <Card>
      <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>최근 검사</CardTitle>

          <Link href="/reports">
            <Button variant="secondary" className="whitespace-nowrap">
              전체
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
        {reportLoadMessage ? (
          <EmptyState
            title="검사 기록을 불러오지 못했습니다"
            description={reportLoadMessage}
          />
        ) : reports.length === 0 ? (
          <EmptyState
            title="검사 기록 없음"
            description=""
            action={
              <Link href="/safecheck">
                <Button>검사하기</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-2">
            {reports.map((report) => (
              <article
                key={report.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{getLevelLabel(report.level)}</Badge>
                  <Badge>점수 {report.score}</Badge>
                  <span className="ml-auto text-xs font-medium text-slate-400">
                    {formatDate(report.createdAt)}
                  </span>
                </div>

                <p className="mt-2 line-clamp-1 text-xs leading-5 text-slate-600">
                  {report.safePrompt || "저장된 안전 문장 안내가 없습니다"}
                </p>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}