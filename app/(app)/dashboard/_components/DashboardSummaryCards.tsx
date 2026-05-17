import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import DashboardSummaryItem from "./DashboardSummaryItem";

type DashboardSummaryCardsProps = {
  email: string;
  promptCount: number;
  latestReport: SafeCheckReport | null;
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

  return "기록 없음";
}

export default function DashboardSummaryCards({
  email,
  promptCount,
  latestReport,
}: DashboardSummaryCardsProps) {
  return (
    <section className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3">
      <DashboardSummaryItem
        label="계정"
        title="현재 로그인"
        value={email}
        valueClassName="text-[11px] sm:text-xs"
      />

      <DashboardSummaryItem
        label="프롬프트"
        title="저장된 항목"
        value={`${promptCount.toLocaleString("ko-KR")}개`}
      />

      <DashboardSummaryItem
        label="최근 검사"
        title={latestReport ? `점수 ${latestReport.score}` : "점수 없음"}
        value={getLevelLabel(latestReport?.level)}
      />
    </section>
  );
}