"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import type { PromptCategory } from "@/features/prompts/types/category.types";
import Button from "@/shared/ui/button";
import ErrorMessage from "@/shared/ui/error-message";
import Input from "@/shared/ui/input";
import LinkButton from "@/shared/ui/link-button";
import PageHeader from "@/shared/ui/page-header";
import PageShell from "@/shared/ui/page-shell";
import Textarea from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { updatePromptAction, type UpdatePromptActionState } from "../actions";

const FIELD_LIMITS = {
  title: 120,
  useCase: 500,
  promptBody: 12000,
  exampleInput: 6000,
  exampleOutput: 6000,
  safetyNotes: 3000,
} as const;

const initialState: UpdatePromptActionState = {
  ok: true,
  message: "",
};

type PromptEditFormProps = {
  email: string;
  prompt: Prompt;
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "수정 중" : "수정 저장"}
    </Button>
  );
}

function FieldCounter({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  return (
    <span className="shrink-0 text-xs text-slate-400">
      {current.toLocaleString("ko-KR")} / {max.toLocaleString("ko-KR")}자
    </span>
  );
}

function FieldHelp({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-slate-500">{children}</p>;
}

export default function PromptEditForm({
  email,
  prompt,
  categories,
  categoryLoadMessage,
}: PromptEditFormProps) {
  const [state, formAction] = useActionState(updatePromptAction, initialState);
  const [titleLength, setTitleLength] = useState(prompt.title.length);
  const [useCaseLength, setUseCaseLength] = useState(prompt.useCase?.length ?? 0);
  const [promptBodyLength, setPromptBodyLength] = useState(prompt.promptBody.length);
  const [exampleInputLength, setExampleInputLength] = useState(
    prompt.exampleInput?.length ?? 0,
  );
  const [exampleOutputLength, setExampleOutputLength] = useState(
    prompt.exampleOutput?.length ?? 0,
  );
  const [safetyNotesLength, setSafetyNotesLength] = useState(
    prompt.safetyNotes?.length ?? 0,
  );

  return (
    <PageShell>
      <PageHeader
        badge="프롬프트 수정"
        title={prompt.title}
        description="저장된 프롬프트의 제목, 본문, 예시, 공개 범위, 상태를 수정합니다. 공개 게시 전에는 SafeCheck 검사를 다시 확인하세요."
        meta={<>로그인 계정: {email}</>}
      />

      <Card>
        <CardHeader className="p-5 sm:p-6">
          <CardTitle>수정 정보</CardTitle>
          <CardDescription>
            변경한 내용은 저장 후 바로 반영됩니다. 공개 + 게시 상태로 바꾸기 전에는 개인정보, 회사기밀, 저작권 위험, 과장 표현이 없는지 확인하세요.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <form action={formAction} className="space-y-4 sm:space-y-5">
            <input type="hidden" name="promptId" value={prompt.id} />

            <label className="block space-y-2">
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">제목</span>
                <FieldCounter current={titleLength} max={FIELD_LIMITS.title} />
              </span>
              <Input
                name="title"
                defaultValue={prompt.title}
                maxLength={FIELD_LIMITS.title}
                onChange={(event) => setTitleLength(event.currentTarget.value.length)}
                required
              />
              <FieldHelp>
                공개 목록과 대시보드에 보이는 이름입니다. 어떤 작업에 쓰는 프롬프트인지 바로 알 수 있게 적으세요.
              </FieldHelp>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">카테고리</span>
              <select
                name="categoryId"
                defaultValue={prompt.categoryId ?? ""}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                <option value="">카테고리 없음</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FieldHelp>
                프롬프트를 찾기 쉽게 묶는 기준입니다.
              </FieldHelp>
              {categoryLoadMessage ? (
                <span className="block text-xs text-red-600">
                  카테고리를 불러오지 못했습니다. {categoryLoadMessage}
                </span>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">사용 목적</span>
                <FieldCounter current={useCaseLength} max={FIELD_LIMITS.useCase} />
              </span>
              <Input
                name="useCase"
                defaultValue={prompt.useCase ?? ""}
                maxLength={FIELD_LIMITS.useCase}
                onChange={(event) => setUseCaseLength(event.currentTarget.value.length)}
              />
              <FieldHelp>
                이 프롬프트를 언제 쓰면 좋은지 적습니다. 짧고 구체적으로 남기면 재사용하기 쉽습니다.
              </FieldHelp>
            </label>

            <label className="block space-y-2">
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  프롬프트 본문
                </span>
                <FieldCounter current={promptBodyLength} max={FIELD_LIMITS.promptBody} />
              </span>
              <Textarea
                name="promptBody"
                className="min-h-44 sm:min-h-60"
                defaultValue={prompt.promptBody}
                maxLength={FIELD_LIMITS.promptBody}
                onChange={(event) =>
                  setPromptBodyLength(event.currentTarget.value.length)
                }
                required
              />
              <FieldHelp>
                AI에게 실제로 입력할 지시문입니다. 역할, 작업 목표, 말투, 금지 표현, 출력 형식이 분명한지 확인하세요.
              </FieldHelp>
            </label>

            <label className="block space-y-2">
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">예시 입력</span>
                <FieldCounter
                  current={exampleInputLength}
                  max={FIELD_LIMITS.exampleInput}
                />
              </span>
              <Textarea
                name="exampleInput"
                className="min-h-24 sm:min-h-28"
                defaultValue={prompt.exampleInput ?? ""}
                maxLength={FIELD_LIMITS.exampleInput}
                onChange={(event) =>
                  setExampleInputLength(event.currentTarget.value.length)
                }
              />
              <FieldHelp>
                실제 개인정보나 주문번호 없이, 사용자가 넣을 수 있는 입력 예시를 적습니다.
              </FieldHelp>
            </label>

            <label className="block space-y-2">
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">예시 출력</span>
                <FieldCounter
                  current={exampleOutputLength}
                  max={FIELD_LIMITS.exampleOutput}
                />
              </span>
              <Textarea
                name="exampleOutput"
                className="min-h-24 sm:min-h-28"
                defaultValue={prompt.exampleOutput ?? ""}
                maxLength={FIELD_LIMITS.exampleOutput}
                onChange={(event) =>
                  setExampleOutputLength(event.currentTarget.value.length)
                }
              />
              <FieldHelp>
                AI가 어떤 형식으로 답해야 하는지 보여주는 샘플입니다.
              </FieldHelp>
            </label>

            <label className="block space-y-2">
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">안전 주의사항</span>
                <FieldCounter
                  current={safetyNotesLength}
                  max={FIELD_LIMITS.safetyNotes}
                />
              </span>
              <Textarea
                name="safetyNotes"
                className="min-h-24 sm:min-h-28"
                defaultValue={prompt.safetyNotes ?? ""}
                maxLength={FIELD_LIMITS.safetyNotes}
                onChange={(event) =>
                  setSafetyNotesLength(event.currentTarget.value.length)
                }
              />
              <FieldHelp>
                개인정보, 회사기밀, 저작권 위험, 과장 표현처럼 사용 시 조심해야 할 내용을 적습니다.
              </FieldHelp>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">공개 범위</span>
                <select
                  name="visibility"
                  defaultValue={prompt.visibility}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="private">비공개</option>
                  <option value="public">공개</option>
                </select>
                <FieldHelp>
                  공개 + 게시 상태만 공개 프롬프트 목록에 표시됩니다.
                </FieldHelp>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">상태</span>
                <select
                  name="status"
                  defaultValue={prompt.status}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="draft">초안</option>
                  <option value="published">게시</option>
                  <option value="archived">보관</option>
                </select>
                <FieldHelp>
                  초안은 작업 중, 게시는 공개 가능, 보관은 목록에서 제외하는 상태입니다.
                </FieldHelp>
              </label>
            </div>

            {!state.ok ? <ErrorMessage message={state.message} /> : null}

            <div className="grid gap-2 sm:flex sm:flex-wrap">
              <SubmitButton />
              <LinkButton
                href={`/prompts/${prompt.id}`}
                size="md"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                상세로 돌아가기
              </LinkButton>
              <LinkButton
                href="/dashboard"
                size="md"
                variant="ghost"
                className="w-full sm:w-auto"
              >
                대시보드
              </LinkButton>
            </div>

            <p className="rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
              수정 저장 전 SafeCheck 검사를 권장합니다. block 판정은 저장되지 않고, review 판정은 비공개 초안으로만 저장할 수 있습니다.
            </p>
          </form>
        </CardContent>
      </Card>

      <Link href="/dashboard" className="sr-only">
        대시보드로 이동
      </Link>
    </PageShell>
  );
}
