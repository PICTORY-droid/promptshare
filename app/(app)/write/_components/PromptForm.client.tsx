"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { PromptCategory } from "@/features/prompts/types/category.types";
import { createPromptAction, type CreatePromptActionState } from "../actions";
import Button from "@/shared/ui/button";
import ErrorMessage from "@/shared/ui/error-message";
import Input from "@/shared/ui/input";
import Textarea from "@/shared/ui/textarea";

const initialState: CreatePromptActionState = {
  ok: true,
  message: "",
};

const FIELD_LIMITS = {
  title: 120,
  useCase: 500,
  promptBody: 12000,
  exampleInput: 6000,
  exampleOutput: 6000,
  safetyNotes: 3000,
} as const;

type PromptFormProps = {
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중" : "프롬프트 저장"}
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
    <span className="text-xs text-slate-400">
      {current.toLocaleString("ko-KR")} / {max.toLocaleString("ko-KR")}자
    </span>
  );
}

export default function PromptForm({
  categories,
  categoryLoadMessage,
}: PromptFormProps) {
  const [state, formAction] = useActionState(createPromptAction, initialState);
  const [titleLength, setTitleLength] = useState(0);
  const [useCaseLength, setUseCaseLength] = useState(0);
  const [promptBodyLength, setPromptBodyLength] = useState(0);
  const [exampleInputLength, setExampleInputLength] = useState(0);
  const [exampleOutputLength, setExampleOutputLength] = useState(0);
  const [safetyNotesLength, setSafetyNotesLength] = useState(0);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">제목</span>
          <FieldCounter current={titleLength} max={FIELD_LIMITS.title} />
        </span>
        <Input
          name="title"
          placeholder="예: 고객 응대 이메일 작성 프롬프트"
          maxLength={FIELD_LIMITS.title}
          onChange={(event) => setTitleLength(event.currentTarget.value.length)}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">카테고리</span>
        <select
          name="categoryId"
          defaultValue=""
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        >
          <option value="">카테고리 없음</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
          placeholder="이 프롬프트를 어떤 상황에서 쓰는지 적어주세요."
          maxLength={FIELD_LIMITS.useCase}
          onChange={(event) => setUseCaseLength(event.currentTarget.value.length)}
        />
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">프롬프트 본문</span>
          <FieldCounter current={promptBodyLength} max={FIELD_LIMITS.promptBody} />
        </span>
        <Textarea
          name="promptBody"
          placeholder="AI에게 입력할 프롬프트를 작성하세요."
          maxLength={FIELD_LIMITS.promptBody}
          onChange={(event) => setPromptBodyLength(event.currentTarget.value.length)}
          required
        />
        <span className="block text-xs leading-5 text-slate-500">
          긴 문서는 그대로 붙여넣기보다 핵심 지시문과 예시만 정리해 넣는 것을 권장합니다.
        </span>
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">예시 입력</span>
          <FieldCounter current={exampleInputLength} max={FIELD_LIMITS.exampleInput} />
        </span>
        <Textarea
          name="exampleInput"
          className="min-h-28"
          placeholder="프롬프트 사용 예시 입력값을 작성하세요."
          maxLength={FIELD_LIMITS.exampleInput}
          onChange={(event) => setExampleInputLength(event.currentTarget.value.length)}
        />
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">예시 출력</span>
          <FieldCounter current={exampleOutputLength} max={FIELD_LIMITS.exampleOutput} />
        </span>
        <Textarea
          name="exampleOutput"
          className="min-h-28"
          placeholder="예상되는 출력 형태를 작성하세요."
          maxLength={FIELD_LIMITS.exampleOutput}
          onChange={(event) => setExampleOutputLength(event.currentTarget.value.length)}
        />
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">안전 주의사항</span>
          <FieldCounter current={safetyNotesLength} max={FIELD_LIMITS.safetyNotes} />
        </span>
        <Textarea
          name="safetyNotes"
          className="min-h-28"
          placeholder="개인정보, 회사기밀, 저작권 위험 등 사용 시 주의할 내용을 적어주세요."
          maxLength={FIELD_LIMITS.safetyNotes}
          onChange={(event) => setSafetyNotesLength(event.currentTarget.value.length)}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">공개 범위</span>
          <select
            name="visibility"
            defaultValue="private"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="private">비공개</option>
            <option value="public">공개</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">상태</span>
          <select
            name="status"
            defaultValue="draft"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="draft">초안</option>
            <option value="published">게시</option>
          </select>
        </label>
      </div>

      {!state.ok ? <ErrorMessage message={state.message} /> : null}

      <div className="flex flex-wrap gap-3">
        <SubmitButton />
        <Button type="button" variant="secondary" disabled>
          AI SafeCheck 연결 예정
        </Button>
      </div>
    </form>
  );
}
