import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import {
  Card,
  CardContent,
} from "@/shared/ui/card";

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
    <span className="shrink-0 whitespace-nowrap text-[11px] font-bold text-slate-500">
      {getVisibilityLabel(prompt.visibility)} {getStatusLabel(prompt.status)}
    </span>
  );
}

export default function DashboardPromptCard({
  prompt,
}: DashboardPromptCardProps) {
  return (
    <Link href={`/prompts/${prompt.id}`} className="block">
      <Card className="transition hover:border-slate-300">
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-sm font-bold leading-5 text-slate-950">
                {prompt.title}
              </h3>

              <p className="mt-1 text-[11px] font-medium text-slate-400">
                {new Date(prompt.updatedAt).toLocaleDateString("ko-KR")}
              </p>
            </div>

            <PromptStateText prompt={prompt} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}