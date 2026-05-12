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
import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";

type PromptDetailProps = {
  prompt: Prompt;
};

function DetailBlock({
  title,
  description,
  content,
}: {
  title: string;
  description?: string;
  content: string | null;
}) {
  return (
    <Card>
      <CardHeader className="p-5 sm:p-6">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
        <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
          {content || "등록된 내용이 없습니다."}
        </p>
      </CardContent>
    </Card>
  );
}

export default function PromptDetail({ prompt }: PromptDetailProps) {
  return (
    <PageShell>
      <PageHeader
        badge="공개 프롬프트"
        title={prompt.title}
        description={prompt.useCase || "사용 목적이 등록되지 않았습니다."}
      />

      <div className="flex flex-wrap items-center gap-2">
        {prompt.categoryName ? <Badge>{prompt.categoryName}</Badge> : null}
        <Badge variant={prompt.visibility === "public" ? "success" : "default"}>
          {prompt.visibility}
        </Badge>
        <Badge>{prompt.status}</Badge>
      </div>

      <div className="grid gap-4 sm:gap-5">
        <DetailBlock
          title="프롬프트 본문"
          description="AI에게 입력하는 핵심 지시문입니다."
          content={prompt.promptBody}
        />

        <DetailBlock
          title="예시 입력"
          description="이 프롬프트에 넣을 수 있는 입력 예시입니다."
          content={prompt.exampleInput}
        />

        <DetailBlock
          title="예시 출력"
          description="기대하는 답변 형식이나 출력 예시입니다."
          content={prompt.exampleOutput}
        />

        <DetailBlock
          title="안전 주의사항"
          description="작성자 또는 SafeCheck가 남긴 사용 주의사항입니다."
          content={prompt.safetyNotes}
        />
      </div>

      <div className="grid gap-2 sm:flex sm:flex-wrap">
        <LinkButton href="/prompts" size="md" variant="secondary">
          공개 목록으로
        </LinkButton>
        <Link href="/prompts" className="sr-only">
          공개 프롬프트 목록
        </Link>
      </div>
    </PageShell>
  );
}