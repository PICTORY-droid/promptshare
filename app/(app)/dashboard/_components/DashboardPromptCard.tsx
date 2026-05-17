import Link from "next/link";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

function PromptStatePill({ prompt }: { prompt: Prompt }) {
  return (
    <span className="inline-flex max-w-full shrink-0 items-center truncate whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold leading-none text-slate-700">
      {getVisibilityLabel(prompt.visibility)} {getStatusLabel(prompt.status)}
    </span>
  );
}

export default function DashboardPromptCard({
  prompt,
}: DashboardPromptCardProps) {
  return (
    <Link href={`/prompts/${prompt.id}`} className="block h-full">
      <Card className="h-full min-h-36 transition hover:border-slate-300">
        <CardHeader className="p-3 pb-2">
          <PromptStatePill prompt={prompt} />
        </CardHeader>

        <CardContent className="flex min-h-24 flex-col justify-between p-3 pt-0">
          <CardTitle className="line-clamp-2 text-sm leading-5">
            {prompt.title}
          </CardTitle>

          <p className="mt-4 text-[11px] font-medium text-slate-400">
            {new Date(prompt.updatedAt).toLocaleDateString("ko-KR")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}