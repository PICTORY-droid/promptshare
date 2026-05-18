import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import SafeCheckForm from "./SafeCheckForm.client";

type SafeCheckShellProps = {
  email: string;
};

export default function SafeCheckShell({}: SafeCheckShellProps) {
  return (
    <PageShell>
      <PageHeader
        badge="AI SafeCheck"
        title="프롬프트 안전 검사"
        description="저장하거나 공개하기 전 개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 점검합니다."
      />

      <SafeCheckForm />
    </PageShell>
  );
}