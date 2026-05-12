import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type ReportCardProps = {
  report: SafeCheckReport;
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

function formatDate(value: string) {
  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{getLevelLabel(report.level)}</Badge>
          <Badge>점수 {report.score}</Badge>
          {report.riskCategories.length === 0 ? (
            <Badge>위험 없음</Badge>
          ) : (
            report.riskCategories.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))
          )}
        </div>

        <CardTitle>검사 기록</CardTitle>
        <CardDescription>
          검사일: {formatDate(report.createdAt)}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-semibold text-emerald-900">
              검사 원문은 저장하지 않습니다.
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              이 기록에는 원문 프롬프트, 고객명, 전화번호, 이메일, 회사기밀 원문이 저장되지 않습니다.
              점수, 판정, 위험 카테고리, 안전 문장 안내만 저장합니다.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500">안전 문장 안내</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {report.safePrompt || "저장된 안전 문장 안내가 없습니다."}
            </p>
          </div>

          <div className="grid gap-2 text-xs text-slate-500">
            <p>정책 버전: {report.policyVersion}</p>
            <p>탐지기 버전: {report.detectorVersion}</p>
            {report.promptId ? <p>연결 프롬프트 ID: {report.promptId}</p> : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}