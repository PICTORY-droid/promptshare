import CheckToolCard, { type CheckToolCardProps } from "./CheckToolCard";

const primaryTool: CheckToolCardProps = {
  title: "SafeCheck",
  description:
    "개인정보, 회사기밀, 계약정보, 저작권 원문, 허위·과장 표현을 저장 또는 공개 전에 점검합니다.",
  status: "사용 가능",
  href: "/safecheck",
  actionLabel: "SafeCheck 시작",
  variant: "primary",
};

const upcomingTools: CheckToolCardProps[] = [
  {
    title: "StyleCheck",
    description: "반복 표현과 과하게 정돈된 문장을 점검합니다.",
    status: "준비 중",
    variant: "compact",
  },
  {
    title: "AI 문체 점검",
    description: "기계적으로 보일 수 있는 문장 패턴을 점검합니다.",
    status: "준비 중",
    variant: "compact",
  },
  {
    title: "Humanize",
    description: "규칙 기반으로 문장을 더 자연스럽게 다듬습니다.",
    status: "준비 중",
    variant: "compact",
  },
  {
    title: "Similarity",
    description: "중복 표현과 원문 반복 위험을 점검합니다.",
    status: "준비 중",
    variant: "compact",
  },
];

const reviewTools: CheckToolCardProps[] = [
  {
    title: "Report",
    description: "검사 기록을 리포트 형태로 정리합니다.",
    status: "검토 예정",
    variant: "mini",
  },
  {
    title: "영상 자막 요약",
    description: "사용자가 붙여넣은 원고 기준으로 요약합니다.",
    status: "검토 예정",
    variant: "mini",
  },
  {
    title: "YouTube 채널 카드",
    description: "API, 개인정보, Play Store 정책 검토 후 판단합니다.",
    status: "검토 예정",
    variant: "mini",
  },
];

export default function CheckToolGrid() {
  return (
    <section className="grid gap-4 sm:gap-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">
          바로 사용 가능
        </p>
        <CheckToolCard {...primaryTool} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">
          준비 중인 검사
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {upcomingTools.map((tool) => (
            <CheckToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">
          검토 예정
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {reviewTools.map((tool) => (
            <CheckToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}