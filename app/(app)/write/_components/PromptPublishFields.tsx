"use client";

import type { PromptDraftState } from "./PromptForm.client";

type PromptPublishFieldsProps = {
  draft: PromptDraftState;
  onChange: <Key extends keyof PromptDraftState>(
    key: Key,
    value: PromptDraftState[Key],
  ) => void;
};

type SaveMode = "private-draft" | "public-draft" | "public-published";

function getSaveMode(draft: PromptDraftState): SaveMode {
  if (draft.visibility === "public" && draft.status === "published") {
    return "public-published";
  }

  if (draft.visibility === "public") {
    return "public-draft";
  }

  return "private-draft";
}

export default function PromptPublishFields({
  draft,
  onChange,
}: PromptPublishFieldsProps) {
  function handleSaveModeChange(value: SaveMode) {
    if (value === "public-published") {
      onChange("visibility", "public");
      onChange("status", "published");
      return;
    }

    if (value === "public-draft") {
      onChange("visibility", "public");
      onChange("status", "draft");
      return;
    }

    onChange("visibility", "private");
    onChange("status", "draft");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-bold text-slate-950">
          저장 전 안전 검사
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          개인정보, 회사기밀, 저작권 원문, 과장 표현 여부 확인
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">저장 방식</span>
        <select
          value={getSaveMode(draft)}
          onChange={(event) =>
            handleSaveModeChange(event.currentTarget.value as SaveMode)
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        >
          <option value="private-draft">비공개 초안</option>
          <option value="public-draft">공개 초안</option>
          <option value="public-published">공개 게시</option>
        </select>
      </label>

      <div className="rounded-2xl bg-slate-50 p-3">
        <p className="text-sm font-bold text-slate-950">권장 설정</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          첫 저장시 비공개 초안/추천 검토 후 공개 게시
        </p>
      </div>
    </div>
  );
}