import type { PromptCategory } from "@/features/prompts/types/category.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import PageHeader from "@/shared/ui/page-header";
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
      <PageHeader
        badge="개인 작성"
        title="프롬프트 작성"
        description="작성 단계에 맞춰 프롬프트를 저장합니다."
      />

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