"use client";

import { useActionState, useState } from "react";
import { scanPromptAction, type SafeCheckActionState } from "../actions";
import ErrorMessage from "@/shared/ui/error-message";
import Textarea from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import SafeCheckSubmitButton from "./SafeCheckSubmitButton.client";
import SafeCheckResultCard from "./SafeCheckResultCard";
import SafeCheckSafePromptCard from "./SafeCheckSafePromptCard";

const MAX_PROMPT_LENGTH = 12000;

const initialState: SafeCheckActionState = {
  ok: true,
  message: "",
  result: null,
  reportId: null,
};

export default function SafeCheckForm() {
  const [state, formAction] = useActionState(scanPromptAction, initialState);
  const [textLength, setTextLength] = useState(0);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>검사할 내용</CardTitle>
          <CardDescription>
            핵심 문단을 붙여넣고 바로 검사하세요.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <form action={formAction} className="space-y-3">
            <label className="block space-y-2">
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700">
                  프롬프트 본문
                </span>
                <span className="shrink-0 text-xs text-slate-400">
                  {textLength.toLocaleString("ko-KR")} /{" "}
                  {MAX_PROMPT_LENGTH.toLocaleString("ko-KR")}자
                </span>
              </span>

              <Textarea
                name="promptText"
                className="min-h-44 sm:min-h-72"
                maxLength={MAX_PROMPT_LENGTH}
                placeholder="검사할 프롬프트를 입력하세요."
                onChange={(event) =>
                  setTextLength(event.currentTarget.value.length)
                }
                required
              />
            </label>

            <p className="text-xs leading-5 text-slate-500">
              긴 문서는 핵심 문단으로 나눠 검사하세요.
            </p>

            {!state.ok ? <ErrorMessage message={state.message} /> : null}

            <SafeCheckSubmitButton />
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 sm:gap-6">
        <SafeCheckResultCard
          result={state.result}
          reportId={state.reportId}
        />

        {state.result ? (
          <SafeCheckSafePromptCard safePrompt={state.result.safePrompt} />
        ) : null}
      </div>
    </div>
  );
}