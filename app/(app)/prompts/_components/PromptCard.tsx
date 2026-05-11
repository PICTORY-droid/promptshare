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

type PromptCardProps = {
  prompt: Prompt;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link href={`/prompts/${prompt.id}`} className="block">
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
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
          <p className="line-clamp-4 text-sm leading-6 text-slate-600">
            {prompt.promptBody}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
