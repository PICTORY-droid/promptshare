import CheckToolCard, { type CheckToolCardProps } from "./CheckToolCard";

const primaryTool: CheckToolCardProps = {
  title: "SafeCheck",
  description: "개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 검사합니다.",
  status: "사용 가능",
  href: "/safecheck",
  variant: "primary",
};

const quickTools: CheckToolCardProps[] = [
  {
    title: "StyleCheck",
    description: "반복 표현 점검",
    status: "준비 중",
    variant: "compact",
  },
  {
    title: "AI 문체",
    description: "기계적 문장 가능성",
    status: "준비 중",
    variant: "compact",
  },
  {
    title: "Humanize",
    description: "규칙 기반 다듬기",
    status: "준비 중",
    variant: "compact",
  },
  {
    title: "Similarity",
    description: "중복 표현 점검",
    status: "준비 중",
    variant: "compact",
  },
];

const laterTools: CheckToolCardProps[] = [
  {
    title: "Report",
    description: "검사 기록 정리",
    status: "준비 중",
    variant: "mini",
  },
  {
    title: "영상 자막 요약",
    description: "붙여넣은 원고 정리",
    status: "준비 중",
    variant: "mini",
  },
  {
    title: "YouTube 채널 카드",
    description: "출시 전 검토",
    status: "검토 예정",
    variant: "mini",
  },
];

export default function CheckToolGrid() {
  return (
    <section className="grid gap-3">
      <CheckToolCard {...primaryTool} />

      <div className="grid grid-cols-2 gap-2">
        {quickTools.map((tool) => (
          <CheckToolCard key={tool.title} {...tool} />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900">
            이후 도구
          </h2>
          <span className="text-[11px] font-medium text-slate-500">
            준비 중
          </span>
        </div>

        <div className="grid gap-1.5 sm:grid-cols-3">
          {laterTools.map((tool) => (
            <CheckToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}