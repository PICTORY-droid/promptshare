import { getCurrentUser } from "@/server/auth/get-current-user";
import { getSafeCheckReports } from "@/features/safecheck/server/get-safecheck-reports";
import ReportsShell from "./_components/ReportsShell";

export default async function ReportsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    return (
      <ReportsShell
        email={null}
        isLoggedIn={false}
        reports={[]}
        reportLoadMessage="로그인 후 개인 계정에 저장된 기록을 확인할 수 있습니다."
      />
    );
  }

  const reportsResult = await getSafeCheckReports(currentUser.user.id);

  return (
    <ReportsShell
      email={currentUser.user.email ?? "로그인 사용자"}
      isLoggedIn={true}
      reports={reportsResult.ok ? reportsResult.data.reports : []}
      reportLoadMessage={reportsResult.ok ? null : reportsResult.message}
    />
  );
}