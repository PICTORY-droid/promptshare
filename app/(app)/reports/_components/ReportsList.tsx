import Link from "next/link";
import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import EmptyState from "@/shared/ui/empty-state";
import ReportsPagination from "./ReportsPagination.client";

type ReportsListProps = {
  reports: SafeCheckReport[];
  reportLoadMessage: string | null;
};

export default function ReportsList({
  reports,
  reportLoadMessage,
}: ReportsListProps) {
  return (
    <Card>
      <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>기록 목록</CardTitle>
            <CardDescription>
              5개씩 나눠 확인합니다.
            </CardDescription>
          </div>

          <Link href="/safecheck">
            <Button className="whitespace-nowrap">새 검사</Button>
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
            description="SafeCheck를 실행하면 기록이 여기에 표시됩니다."
            action={
              <Link href="/safecheck">
                <Button>첫 검사 실행</Button>
              </Link>
            }
          />
        ) : (
          <ReportsPagination reports={reports} />
        )}
      </CardContent>
    </Card>
  );
}