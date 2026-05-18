import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { getOwnPrompts } from "@/features/prompts/server/get-prompts";
import { getSafeCheckReports } from "@/features/safecheck/server/get-safecheck-reports";
import DashboardShell from "./_components/DashboardShell";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  const [promptsResult, reportsResult] = await Promise.all([
    getOwnPrompts(currentUser.user.id),
    getSafeCheckReports(currentUser.user.id),
  ]);

  return (
    <DashboardShell
      email={currentUser.user.email ?? "로그인 사용자"}
      prompts={promptsResult.ok ? promptsResult.prompts : []}
      promptLoadMessage={promptsResult.ok ? null : promptsResult.message}
      reports={reportsResult.ok ? reportsResult.data.reports : []}
      reportLoadMessage={reportsResult.ok ? null : reportsResult.message}
    />
  );
}