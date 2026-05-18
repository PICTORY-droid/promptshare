import type { Prompt } from "@/features/prompts/types/prompt.types";
import Badge from "@/shared/ui/badge";
import PageShell from "@/shared/ui/page-shell";
import DashboardPromptList from "./DashboardPromptList";
import DashboardSummaryCards from "./DashboardSummaryCards";

type DashboardShellProps = {
  email: string;
  prompts: Prompt[];
  promptLoadMessage: string | null;
};

export default function DashboardShell({
  prompts,
  promptLoadMessage,
}: DashboardShellProps) {
  return (
    <PageShell>
      <header className="space-y-2">
        <Badge>개인 메뉴</Badge>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          내 프롬프트를 확인합니다.
        </p>
      </header>

      <DashboardSummaryCards promptCount={prompts.length} />

      <DashboardPromptList
        prompts={prompts}
        promptLoadMessage={promptLoadMessage}
      />
    </PageShell>
  );
}