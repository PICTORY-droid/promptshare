import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import LinkButton from "@/shared/ui/link-button";

type PromptCardProps = {
  prompt: Prompt;
};

export default function PromptCard({ prompt }: PromptCardProps) {
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

        <CardTitle className="leading-7">
          <Link
            href={`/prompts/${prompt.id}`}
            className="transition hover:text-slate-600 active:text-slate-500"
          >
            {prompt.title}
          </Link>
        </CardTitle>

        <CardDescription className="line-clamp-3 leading-6">
          {prompt.useCase || "사용 목적이 등록되지 않았습니다."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {prompt.promptBody}
          </p>

          <LinkButton href={`/prompts/${prompt.id}`} size="md" className="w-full">
            상세
          </LinkButton>
        </div>
      </CardContent>
    </Card>
  );
}