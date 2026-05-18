import type { SafeCheckResult } from "@/features/safecheck/types/safecheck.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import SafeCheckEmptyResult from "./SafeCheckEmptyResult";
import SafeCheckFindingList from "./SafeCheckFindingList";

type SafeCheckResultCardProps = {
  result: SafeCheckResult | null;
  reportId: string | null;
};

function getLevelLabel(level: string) {
  if (level === "block") {
    return "차단";
  }

  if (level === "review") {
    return "검토 필요";
  }

  return "허용";
}

export default function SafeCheckResultCard({
  result,
  reportId,
}: SafeCheckResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>검사 결과</CardTitle>
      </CardHeader>
      <CardContent>
        {!result ? (
          <SafeCheckEmptyResult />
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{getLevelLabel(result.level)}</Badge>
                <Badge>점수 {result.score}</Badge>
                {reportId ? <Badge>저장됨</Badge> : null}
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                위험 항목 {result.findings.length}개가 확인됐습니다.
              </p>
            </div>

            <SafeCheckFindingList findings={result.findings} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}