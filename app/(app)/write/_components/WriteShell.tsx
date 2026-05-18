import type { PromptCategory } from "@/features/prompts/types/category.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import PageShell from "@/shared/ui/page-shell";
import PromptForm from "./PromptForm.client";

type WriteShellProps = {
  email: string;
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

export default function WriteShell({
  categories,
  categoryLoadMessage,
}: WriteShellProps) {
  return (
    <PageShell maxWidth="md">
      <header className="space-y-2">
        <Badge>개인 작성</Badge>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          작성 단계에 맞춰 프롬프트를 저장합니다.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>작성 단계</CardTitle>
        </CardHeader>

        <CardContent>
          <PromptForm
            categories={categories}
            categoryLoadMessage={categoryLoadMessage}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}