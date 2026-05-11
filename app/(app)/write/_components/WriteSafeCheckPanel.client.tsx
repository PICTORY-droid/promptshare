"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { scanPromptAction, type SafeCheckActionState } from "@/app/(app)/safecheck/actions";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import ErrorMessage from "@/shared/ui/error-message";
import Textarea from "@/shared/ui/textarea";

const MAX_PROMPT_LENGTH = 12000;

const initialState: SafeCheckActionState = {
  ok: true,
  message: "",
  result: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "검사 중" : "본문 검사하기"}
    </Button>
  );
}

function getLevelLabel(level: string) {
  if (level === "block") {
    return "차단";
  }

  if (level === "review") {
    return "검토 필요";
  }

  return "허용";
}

export default function WriteSafeCheckPanel() {
  const [state, formAction] = useActionState(scanPromptAction, initialState);
  const [textLength, setTextLength] = useState(0);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">
            검사할 프롬프트 본문
          </span>
          <span className="text-xs text-slate-400">
            {textLength.toLocaleString("ko-KR")} /{" "}
            {MAX_PROMPT_LENGTH.toLocaleString("ko-KR")}자
          </span>
        </span>

        <Textarea
          name="promptText"
          className="min-h-44"
          maxLength={MAX_PROMPT_LENGTH}
          placeholder="왼쪽 프롬프트 본문을 복사해 붙여넣고 검사하세요."
          onChange={(event) => setTextLength(event.currentTarget.value.length)}
          required
        />
      </label>

      <p className="text-xs leading-5 text-slate-500">
        현재는 저장 폼과 검사 폼을 분리했습니다. 검사 결과를 확인한 뒤 왼쪽 저장 버튼을 누르세요.
      </p>

      {!state.ok ? <ErrorMessage message={state.message} /> : null}

      <SubmitButton />

      {!state.result ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-800">
            아직 검사 결과가 없습니다.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            프롬프트 본문을 붙여넣고 검사하기를 누르세요.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{getLevelLabel(state.result.level)}</Badge>
            <Badge>점수 {state.result.score}</Badge>
          </div>

          {state.result.findings.length === 0 ? (
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">
                탐지된 위험 요소가 없습니다.
              </p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                공개 전 최종 문맥 검토는 별도로 진행하세요.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.result.findings.map((finding) => (
                <div
                  key={finding.category}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{finding.label}</Badge>
                    <span className="text-xs text-slate-400">
                      +{finding.score}점
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {finding.reason}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    탐지값: {finding.matches.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="mb-2 text-sm font-semibold text-slate-800">
              안전 문장 안내
            </p>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {state.result.safePrompt}
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
