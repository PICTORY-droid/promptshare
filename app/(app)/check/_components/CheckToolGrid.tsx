import CheckToolCard, { type CheckToolCardProps } from "./CheckToolCard";

const primaryTool: CheckToolCardProps = {
  title: "SafeCheck",
  description: "개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 검사합니다.",
  status: "사용 가능",
  href: "/safecheck",
  variant: "primary",
};

const secondaryTools: CheckToolCardProps[] = [
  {
    title: "StyleCheck",
    description: "문장 길이, 반복 표현, 어색한 연결어를 점검합니다.",
    status: "준비 중",
  },
  {
    title: "AI 문체 점검",
    description: "지나치게 기계적인 문장 패턴 가능성을 확인합니다.",
    status: "준비 중",
  },
  {
    title: "Humanize",
    description: "규칙 기반으로 딱딱한 문장을 더 자연스럽게 다듬습니다.",
    status: "준비 중",
  },
  {
    title: "Similarity",
    description: "중복 표현과 원문 반복 위험을 점검합니다.",
    status: "준비 중",
  },
  {
    title: "Report",
    description: "검사 결과를 저장하고 출력할 수 있게 정리합니다.",
    status: "준비 중",
  },
  {
    title: "영상 자막 요약",
    description: "사용자가 붙여넣은 영상 자막이나 원고를 정리합니다.",
    status: "준비 중",
  },
  {
    title: "YouTube 채널 카드",
    description: "채널 URL 또는 ID 기반 카드 관리를 검토합니다.",
    status: "검토 예정",
  },
];

export default function CheckToolGrid() {
  return (
    <section className="grid gap-4">
      <CheckToolCard {...primaryTool} />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            다음 도구
          </h2>
          <p className="text-xs font-medium text-slate-500">
            준비 중인 기능
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {secondaryTools.map((tool) => (
            <CheckToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
