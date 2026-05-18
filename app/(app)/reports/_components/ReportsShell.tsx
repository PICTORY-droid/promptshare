import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import ReportsList from "./ReportsList";
import ReportsSummary from "./ReportsSummary";

type ReportsShellProps = {
  email: string;
  reports: SafeCheckReport[];
  reportLoadMessage: string | null;
};

export default function ReportsShell({
  reports,
  reportLoadMessage,
}: ReportsShellProps) {
  const latestReport = reports[0] ?? null;

  return (
    <PageShell>
      <PageHeader
        badge="기록"
        title="검사 기록"
      />

      <ReportsSummary
        reportCount={reports.length}
        latestReport={latestReport}
      />

      <ReportsList
        reports={reports}
        reportLoadMessage={reportLoadMessage}
      />
    </PageShell>
  );
}