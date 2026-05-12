import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          {prompt.categoryName ? <Badge>{prompt.categoryName}</Badge> : null}
          <Badge variant={prompt.visibility === "public" ? "success" : "default"}>
            {prompt.visibility}
          </Badge>
          <Badge>{prompt.status}</Badge>
        </div>

        <CardTitle>{prompt.title}</CardTitle>
        <CardDescription>
          {prompt.useCase || "사용 목적이 아직 입력되지 않았습니다."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {prompt.promptBody}
        </p>

        <p className="mt-4 text-xs text-slate-400">
          수정일: {new Date(prompt.updatedAt).toLocaleDateString("ko-KR")}
        </p>

        {isArchived ? (
          <p className="mt-4 rounded-2xl bg-slate-100 p-3 text-xs leading-5 text-slate-500">
            보관 처리된 프롬프트입니다. 공개 목록에는 표시되지 않습니다.
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
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