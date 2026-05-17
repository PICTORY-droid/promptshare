import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import ArchivePromptButton from "./ArchivePromptButton.client";
import RestorePromptButton from "./RestorePromptButton.client";

type DashboardPromptRowProps = {
  prompt: Prompt;
};

export default function DashboardPromptRow({ prompt }: DashboardPromptRowProps) {
  const isArchived = prompt.status === "archived";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            {prompt.categoryName ? <Badge>{prompt.categoryName}</Badge> : null}
            <Badge variant={prompt.visibility === "public" ? "success" : "default"}>
              {prompt.visibility}
            </Badge>
            <Badge>{prompt.status}</Badge>
          </div>

          <h3 className="line-clamp-1 text-sm font-bold text-slate-950">
            {prompt.title}
          </h3>

          <p className="mt-1 line-clamp-1 text-xs leading-5 text-slate-500">
            {prompt.useCase || prompt.promptBody || "설명이 없습니다."}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            수정일: {new Date(prompt.updatedAt).toLocaleDateString("ko-KR")}
          </p>
        </div>

        <Link href={`/prompts/${prompt.id}`} className="shrink-0">
          <Button variant="secondary">상세</Button>
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {isArchived ? (
          <RestorePromptButton promptId={prompt.id} />
        ) : (
          <>
            <Link href={`/prompts/${prompt.id}/edit`}>
              <Button variant="secondary">수정</Button>
            </Link>
            <ArchivePromptButton promptId={prompt.id} />
          </>
        )}
      </div>
    </article>
  );
}