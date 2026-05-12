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
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
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
    <span className="shrink-0 text-xs text-slate-400">
      {current.toLocaleString("ko-KR")} / {max.toLocaleString("ko-KR")}자
    </span>
  );
}

function FieldHelp({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-5 text-slate-500">{children}</p>;
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
    <form action={formAction} className="space-y-4 sm:space-y-5">
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
        <FieldHelp>
          프롬프트 목록에 보이는 이름입니다. 어떤 작업에 쓰는 프롬프트인지 한눈에 알 수 있게 적으세요.
        </FieldHelp>
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
        <FieldHelp>
          업무, 글쓰기, 마케팅처럼 프롬프트를 찾기 쉽게 묶는 기준입니다.
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
          placeholder="예: 고객 문의를 정중한 답변 이메일로 바꿀 때 사용"
          maxLength={FIELD_LIMITS.useCase}
          onChange={(event) => setUseCaseLength(event.currentTarget.value.length)}
        />
        <FieldHelp>
          이 프롬프트를 언제 쓰면 좋은지 적습니다. 나중에 다시 찾을 때 가장 도움이 됩니다.
        </FieldHelp>
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">프롬프트 본문</span>
          <FieldCounter current={promptBodyLength} max={FIELD_LIMITS.promptBody} />
        </span>
        <Textarea
          name="promptBody"
          className="min-h-44 sm:min-h-60"
          placeholder={`예:
당신은 고객 응대 담당자입니다.
아래 고객 문의를 정중하고 명확한 이메일 답변으로 작성하세요.
확인되지 않은 내용은 단정하지 말고, 필요한 경우 확인 후 안내한다고 표현하세요.`}
          maxLength={FIELD_LIMITS.promptBody}
          onChange={(event) => setPromptBodyLength(event.currentTarget.value.length)}
          required
        />
        <FieldHelp>
          AI에게 실제로 입력할 지시문입니다. 역할, 작업 목표, 말투, 금지할 표현, 출력 형식을 함께 적으면 품질이 좋아집니다.
        </FieldHelp>
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">예시 입력</span>
          <FieldCounter current={exampleInputLength} max={FIELD_LIMITS.exampleInput} />
        </span>
        <Textarea
          name="exampleInput"
          className="min-h-24 sm:min-h-28"
          placeholder="예: 배송 일정이 언제인지 묻는 고객 메시지"
          maxLength={FIELD_LIMITS.exampleInput}
          onChange={(event) => setExampleInputLength(event.currentTarget.value.length)}
        />
        <FieldHelp>
          사용자가 이 프롬프트에 넣을 수 있는 예시 문장입니다. 실제 개인정보나 주문번호는 넣지 마세요.
        </FieldHelp>
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">예시 출력</span>
          <FieldCounter current={exampleOutputLength} max={FIELD_LIMITS.exampleOutput} />
        </span>
        <Textarea
          name="exampleOutput"
          className="min-h-24 sm:min-h-28"
          placeholder="예: 안녕하세요. 문의 주셔서 감사합니다. 배송 일정은 확인 후 안내드리겠습니다."
          maxLength={FIELD_LIMITS.exampleOutput}
          onChange={(event) => setExampleOutputLength(event.currentTarget.value.length)}
        />
        <FieldHelp>
          AI가 어떤 형식으로 답해야 하는지 보여주는 샘플입니다. 원하는 문체와 구조를 짧게 보여주세요.
        </FieldHelp>
      </label>

      <label className="block space-y-2">
        <span className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-700">안전 주의사항</span>
          <FieldCounter current={safetyNotesLength} max={FIELD_LIMITS.safetyNotes} />
        </span>
        <Textarea
          name="safetyNotes"
          className="min-h-24 sm:min-h-28"
          placeholder="예: 고객명, 전화번호, 이메일, 주문번호, 내부 단가, 계약 조건은 입력하지 않습니다."
          maxLength={FIELD_LIMITS.safetyNotes}
          onChange={(event) => setSafetyNotesLength(event.currentTarget.value.length)}
        />
        <FieldHelp>
          이 프롬프트를 사용할 때 조심해야 할 내용을 적습니다. 개인정보, 회사기밀, 저작권 위험, 과장 표현을 중심으로 작성하세요.
        </FieldHelp>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
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
          <FieldHelp>
            비공개는 본인 대시보드에서만 보이고, 공개는 게시 상태일 때 공개 목록에 표시됩니다.
          </FieldHelp>
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
          <FieldHelp>
            초안은 작업 중인 상태이고, 게시는 공개 가능한 상태입니다. 처음 저장할 때는 초안을 권장합니다.
          </FieldHelp>
        </label>
      </div>

      {!state.ok ? <ErrorMessage message={state.message} /> : null}

      <div className="space-y-3">
        <SubmitButton />
        <p className="rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
          저장 전에는 상단 SafeCheck 요약 카드에서 프롬프트 본문을 먼저 검사하세요.
          block 판정은 저장되지 않고, review 판정은 비공개 초안으로만 저장할 수 있습니다.
        </p>
      </div>
    </form>
  );
}