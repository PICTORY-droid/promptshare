import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { getSafeCheckReports } from "@/features/safecheck/server/get-safecheck-reports";
import ReportsShell from "./_components/ReportsShell";

export default async function ReportsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  const reportsResult = await getSafeCheckReports(currentUser.user.id);

  return (
    <ReportsShell
      email={currentUser.user.email ?? "로그인 사용자"}
      reports={reportsResult.ok ? reportsResult.reports : []}
      reportLoadMessage={reportsResult.ok ? null : reportsResult.message}
    />
  );
}
