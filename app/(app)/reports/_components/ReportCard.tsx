import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import DeleteReportButton from "./DeleteReportButton.client";

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
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export default function ReportCard({ report }: ReportCardProps) {
  const firstCategory = report.riskCategories[0] ?? "위험 없음";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <span className="whitespace-nowrap">
              {getLevelLabel(report.level)}
            </span>
            <span className="text-slate-300">·</span>
            <span className="whitespace-nowrap">점수 {report.score}</span>
            <span className="text-slate-300">·</span>
            <span className="max-w-28 truncate whitespace-nowrap">
              {firstCategory}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-sm font-semibold leading-6 text-slate-950">
            {report.safePrompt || "저장된 안전 문장 안내가 없습니다."}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {formatDate(report.createdAt)}
          </p>
        </div>

        <DeleteReportButton reportId={report.id} />
      </div>
    </article>
  );
}