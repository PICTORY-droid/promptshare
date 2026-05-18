import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import Badge from "@/shared/ui/badge";
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
      <header className="space-y-2">
        <Badge>기록</Badge>
      </header>

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