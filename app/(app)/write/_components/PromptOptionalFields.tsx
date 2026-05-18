"use client";

import type { PromptCategory } from "@/features/prompts/types/category.types";
import type { PromptDraftState } from "./PromptForm.client";
import Textarea from "@/shared/ui/textarea";

type PromptOptionalFieldsProps = {
  draft: PromptDraftState;
  limits: {
    safetyNotes: number;
  };
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
  onChange: <Key extends keyof PromptDraftState>(
    key: Key,
    value: PromptDraftState[Key],
  ) => void;
};

export default function PromptOptionalFields({
  draft,
  limits,
  categories,
  categoryLoadMessage,
  onChange,
}: PromptOptionalFieldsProps) {
  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">보관 분류</span>
        <select
          value={draft.categoryId}
          onChange={(event) => onChange("categoryId", event.currentTarget.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        >
          <option value="">분류 없이 저장</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {categoryLoadMessage ? (
          <span className="block text-xs text-red-600">
            분류를 불러오지 못했습니다. {categoryLoadMessage}
          </span>
        ) : null}
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">
            입력 제외 정보
          </span>
          <span className="text-xs text-slate-400">
            {draft.safetyNotes.length.toLocaleString("ko-KR")} /{" "}
            {limits.safetyNotes.toLocaleString("ko-KR")}자
          </span>
        </span>
        <Textarea
          className="min-h-24"
          value={draft.safetyNotes}
          placeholder="예: 고객명, 전화번호, 내부 단가, 계약 조건은 빼고 작성합니다."
          maxLength={limits.safetyNotes}
          onChange={(event) => onChange("safetyNotes", event.currentTarget.value)}
        />
      </label>
    </div>
  );
}