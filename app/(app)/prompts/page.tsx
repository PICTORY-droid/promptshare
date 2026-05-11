import Link from "next/link";
import { getPublicPrompts } from "@/features/prompts/server/get-prompts";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import PromptList from "./_components/PromptList";

export default async function PromptsPage() {
  const result = await getPublicPrompts();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Badge>PromptLab Library</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              공개 프롬프트
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              PromptLab v3에서 공개된 고품질 프롬프트를 확인하는 화면입니다.
              다음 단계에서 작성, 저장, 상세 조회 흐름과 연결합니다.
            </p>
          </div>

          <Link href="/write">
            <Button>프롬프트 작성하기</Button>
          </Link>
        </div>

        {!result.ok ? (
          <EmptyState
            title="프롬프트를 불러오지 못했습니다"
            description={result.message}
          />
        ) : result.prompts.length === 0 ? (
          <EmptyState
            title="아직 공개된 프롬프트가 없습니다"
            description="프롬프트 작성 화면에서 공개 상태로 저장하면 이곳에 표시됩니다."
            action={
              <Link href="/write">
                <Button>첫 프롬프트 작성하기</Button>
              </Link>
            }
          />
        ) : (
          <PromptList prompts={result.prompts} />
        )}
      </section>
    </main>
  );
}
