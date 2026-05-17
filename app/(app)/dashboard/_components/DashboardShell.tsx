import type { Prompt } from "@/features/prompts/types/prompt.types";
import type { SafeCheckReport } from "@/features/safecheck/types/report.types";
import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import DashboardPromptList from "./DashboardPromptList";
import DashboardRecentReports from "./DashboardRecentReports";
import DashboardSummaryCards from "./DashboardSummaryCards";

type DashboardShellProps = {
  email: string;
  prompts: Prompt[];
  promptLoadMessage: string | null;
  reports: SafeCheckReport[];
  reportLoadMessage: string | null;
};

export default function DashboardShell({
  email,
  prompts,
  promptLoadMessage,
  reports,
  reportLoadMessage,
}: DashboardShellProps) {
  return (
    <PageShell>
      <PageHeader
        badge="개인 메뉴"
        title="대시보드"
        description="내 프롬프트와 최근 검사 기록을 확인합니다."
        meta={<>로그인 계정: {email}</>}
      />

      <DashboardSummaryCards
        email={email}
        promptCount={prompts.length}
        latestReport={reports[0] ?? null}
      />

      <DashboardRecentReports
        reports={reports.slice(0, 2)}
        reportLoadMessage={reportLoadMessage}
      />

      <DashboardPromptList
        prompts={prompts}
        promptLoadMessage={promptLoadMessage}
      />
    </PageShell>
  );
}