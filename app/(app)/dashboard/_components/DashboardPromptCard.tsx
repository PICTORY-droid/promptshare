import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import { Card, CardContent } from "@/shared/ui/card";

type DashboardPromptCardProps = {
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

function PromptStateText({ prompt }: { prompt: Prompt }) {
  return (
    <span className="block truncate whitespace-nowrap text-[10px] font-bold text-slate-500">
      {getVisibilityLabel(prompt.visibility)} {getStatusLabel(prompt.status)}
    </span>
  );
}

export default function DashboardPromptCard({
  prompt,
}: DashboardPromptCardProps) {
  return (
    <Link href={`/prompts/${prompt.id}`} className="block h-full">
      <Card className="h-full transition hover:border-slate-300">
        <CardContent className="flex min-h-32 flex-col justify-between p-3">
          <div className="space-y-3">
            <PromptStateText prompt={prompt} />

            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-950">
              {prompt.title}
            </h3>
          </div>

          <p className="pt-4 text-[11px] font-medium text-slate-400">
            {new Date(prompt.updatedAt).toLocaleDateString("ko-KR")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}