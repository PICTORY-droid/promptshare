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
          <div className="flex items-center gap-2">
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

          <p className="mt-4 text-xs text-slate-400">
            생성일: {new Date(prompt.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
