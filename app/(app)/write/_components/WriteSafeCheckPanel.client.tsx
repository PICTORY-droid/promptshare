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
  reportId: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" disabled={pending} className="w-full sm:w-auto">
      {pending ? "검사 중" : "저장 전 검사하기"}
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

function getLevelDescription(level: string) {
  if (level === "block") {
    return "위험도가 높아 저장 전 본문 수정이 필요합니다.";
  }

  if (level === "review") {
    return "위험 요소가 있어 비공개 초안 저장을 권장합니다.";
  }

  return "큰 위험 요소는 탐지되지 않았습니다.";
}

export default function WriteSafeCheckPanel() {
  const [state, formAction] = useActionState(scanPromptAction, initialState);
  const [textLength, setTextLength] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const result = state.result;

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <label className="block space-y-2">
          <span className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-700">
              검사할 프롬프트 본문
            </span>
            <span className="shrink-0 text-xs text-slate-400">
              {textLength.toLocaleString("ko-KR")} /{" "}
              {MAX_PROMPT_LENGTH.toLocaleString("ko-KR")}자
            </span>
          </span>

          <Textarea
            name="promptText"
            className="min-h-32 sm:min-h-40"
            maxLength={MAX_PROMPT_LENGTH}
            placeholder="아래 프롬프트 정보의 본문만 복사해 붙여넣고 저장 전에 검사하세요."
            onChange={(event) => setTextLength(event.currentTarget.value.length)}
            required
          />
        </label>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">저장 전 검사 기준</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 확인합니다.
            검사 결과는 저장 전 판단을 돕기 위한 기준입니다.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {!result ? (
              <Badge>검사 전</Badge>
            ) : (
              <>
                <Badge>{getLevelLabel(result.level)}</Badge>
                <Badge>점수 {result.score}</Badge>
                {state.reportId ? <Badge>기록 저장됨</Badge> : null}
              </>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {result
              ? getLevelDescription(result.level)
              : "프롬프트 본문넣고 저장 전 검사하기"}
          </p>
        </div>
      </div>

      {!state.ok ? <ErrorMessage message={state.message} /> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />

        {result ? (
          <button
            type="button"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => setIsDetailOpen((current) => !current)}
            aria-expanded={isDetailOpen}
          >
            {isDetailOpen ? "상세 접기" : "상세 보기"}
          </button>
        ) : null}
      </div>

      {!result ? null : (
        <div className={isDetailOpen ? "space-y-4" : "hidden"}>
          {result.findings.length === 0 ? (
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-900">
                탐지된 위험 요소가 없습니다.
              </p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                저장 전 마지막으로 실제 개인정보나 내부자료가 들어가지 않았는지 확인하세요.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.findings.map((finding) => (
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

                  <p className="mt-2 break-words text-xs leading-5 text-slate-500">
                    탐지값: {finding.matches.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="mb-2 text-sm font-semibold text-slate-800">
              수정 안내
            </p>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {result.safePrompt}
            </p>
          </div>
        </div>
      )}
    </form>
  );
}