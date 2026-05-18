import type { PromptCategory } from "@/features/prompts/types/category.types";
import Badge from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import PromptForm from "./PromptForm.client";

type WriteShellProps = {
  email: string;
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

export default function WriteShell({
  email,
  categories,
  categoryLoadMessage,
}: WriteShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-8">
      <section className="mx-auto flex max-w-3xl flex-col gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Badge>개인 작성</Badge>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                프롬프트 작성
              </h1>
            </div>

            <p className="hidden max-w-48 truncate rounded-2xl bg-slate-50 px-3 py-2 text-right text-xs font-semibold text-slate-500 sm:block">
              {email}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
            <CardTitle>작성 단계</CardTitle>
          </CardHeader>

          <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
            <PromptForm
              categories={categories}
              categoryLoadMessage={categoryLoadMessage}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}