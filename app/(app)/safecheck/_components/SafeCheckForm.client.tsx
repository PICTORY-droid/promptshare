"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { scanPromptAction, type SafeCheckActionState } from "../actions";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import ErrorMessage from "@/shared/ui/error-message";
import Textarea from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

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
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "검사 중" : "검사하기"}
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

export default function SafeCheckForm() {
  const [state, formAction] = useActionState(scanPromptAction, initialState);
  const [textLength, setTextLength] = useState(0);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
      <Card>
        <CardHeader className="p-5 sm:p-6">
          <CardTitle>프롬프트 검사</CardTitle>
          <CardDescription>
            개인정보, 회사기밀, 계약정보, 저작권 위험, 허위·과장 표현을 검사합니다
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <form action={formAction} className="space-y-4">
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
                className="min-h-52 sm:min-h-72"
                maxLength={MAX_PROMPT_LENGTH}
                placeholder="검사할 프롬프트를 입력하세요"
                onChange={(event) =>
                  setTextLength(event.currentTarget.value.length)
                }
                required
              />
            </label>

            <p className="text-xs leading-5 text-slate-500">
              긴 문서는 핵심 지시문과 예시로 검사 권장
            </p>

            {!state.ok ? <ErrorMessage message={state.message} /> : null}

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5 sm:gap-6">
        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle>검사 결과</CardTitle>
            <CardDescription>
              룰 기반 검사 결과. LLM 미사용
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            {!state.result ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 sm:p-5">
                <p className="text-sm font-semibold text-slate-800">
                  검사결과 없음
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  상단 입력창에서 검사하기
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{getLevelLabel(state.result.level)}</Badge>
                  <Badge>점수 {state.result.score}</Badge>
                  {state.reportId ? <Badge>리포트 저장됨</Badge> : null}
                  <Badge>{state.result.metadata.policyVersion}</Badge>
                </div>

                {state.result.findings.length === 0 ? (
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-sm font-semibold text-emerald-900">
                      탐지된 위험 요소가 없습니다
                    </p>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      공개 전 최종 문맥 검토는 별도로 진행하는 것을 권장합니다
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

                        <p className="mt-2 break-words text-xs leading-5 text-slate-500">
                          탐지값: {finding.matches.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-5 sm:p-6">
            <CardTitle>안전 문장 안내</CardTitle>
            <CardDescription>
              위험 요소 발생시 공개 전 수정 방향 안내
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {state.result?.safePrompt ?? "검사 후 이곳에 표시됨"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}