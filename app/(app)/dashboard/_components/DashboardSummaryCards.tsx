import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import StatCard from "@/shared/ui/stat-card";

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

  return "-";
}

export default function DashboardSummaryCards({
  email,
  promptCount,
  latestReport,
}: DashboardSummaryCardsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      <StatCard
        title="계정"
        description="현재 로그인"
        value={<span className="block truncate text-sm">{email}</span>}
      />

      <StatCard
        title="프롬프트"
        description="저장된 항목"
        value={promptCount}
      />

      <StatCard
        title="최근 검사"
        description={
          latestReport ? `점수 ${latestReport.score}` : "기록 없음"
        }
        value={getLevelLabel(latestReport?.level)}
      />
    </section>
  );
}