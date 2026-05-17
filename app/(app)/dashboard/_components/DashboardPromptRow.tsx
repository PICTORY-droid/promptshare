import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import Button from "@/shared/ui/button";

type DashboardPromptRowProps = {
  prompt: Prompt;
};

function getStatusLabel(status: string) {
  if (status === "archived") {
    return "보관";
  }

  if (status === "published") {
    return "게시";
  }

  return "초안";
}

function getVisibilityLabel(visibility: string) {
  if (visibility === "public") {
    return "공개";
  }

  return "비공개";
}

function PromptPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold leading-none text-slate-700">
      {children}
    </span>
  );
}

export default function DashboardPromptRow({ prompt }: DashboardPromptRowProps) {
  const description = prompt.useCase || prompt.promptBody || "설명이 없습니다.";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <PromptPill>{getVisibilityLabel(prompt.visibility)}</PromptPill>
            <PromptPill>{getStatusLabel(prompt.status)}</PromptPill>
          </div>

          <h3 className="line-clamp-1 text-sm font-bold text-slate-950">
            {prompt.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-500">
            {description}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {new Date(prompt.updatedAt).toLocaleDateString("ko-KR")}
          </p>
        </div>

        <Link href={`/prompts/${prompt.id}`} className="shrink-0">
          <Button variant="secondary">보기</Button>
        </Link>
      </div>
    </article>
  );
}