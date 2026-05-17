import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import ArchivePromptButton from "./ArchivePromptButton.client";
import RestorePromptButton from "./RestorePromptButton.client";

type DashboardPromptCardProps = {
  prompt: Prompt;
};

export default function DashboardPromptCard({
  prompt,
}: DashboardPromptCardProps) {
  const isArchived = prompt.status === "archived";

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {prompt.categoryName ? <Badge>{prompt.categoryName}</Badge> : null}
          <Badge variant={prompt.visibility === "public" ? "success" : "default"}>
            {prompt.visibility}
          </Badge>
          <Badge>{prompt.status}</Badge>
        </div>

        <CardTitle className="line-clamp-1 text-base">
          {prompt.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="line-clamp-2 text-xs leading-5 text-slate-600">
          {prompt.useCase || prompt.promptBody}
        </p>

        <p className="mt-3 text-xs text-slate-400">
          수정일: {new Date(prompt.updatedAt).toLocaleDateString("ko-KR")}
        </p>

        {isArchived ? (
          <p className="mt-3 rounded-2xl bg-slate-100 p-3 text-xs leading-5 text-slate-500">
            보관 처리됨
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/prompts/${prompt.id}`}>
            <Button variant="secondary">상세</Button>
          </Link>

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
      </CardContent>
    </Card>
  );
}