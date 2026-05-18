import PageHeader from "@/shared/ui/page-header";

export default function CheckPageHeader() {
  return (
    <PageHeader
      badge="PromptLab Check"
      title="검사작업"
      description="생성형 AI 입력 전 민감정보와 보안 위험을 점검합니다."
    />
  );
}