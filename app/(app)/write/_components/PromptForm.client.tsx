"use client";

import { useActionState, useState } from "react";
import type { PromptCategory } from "@/features/prompts/types/category.types";
import { createPromptAction, type CreatePromptActionState } from "../actions";
import ErrorMessage from "@/shared/ui/error-message";
import LoginRequiredDialog from "@/shared/ui/LoginRequiredDialog.client";
import PromptCoreFields from "./PromptCoreFields";
import PromptFormActions from "./PromptFormActions";
import PromptFormStepTabs, { type PromptFormStep } from "./PromptFormStepTabs";
import PromptOptionalFields from "./PromptOptionalFields";
import PromptPublishFields from "./PromptPublishFields";

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
  isLoggedIn: boolean;
  categories: PromptCategory[];
  categoryLoadMessage: string | null;
};

export type PromptDraftState = {
  title: string;
  categoryId: string;
  useCase: string;
  promptBody: string;
  exampleInput: string;
  exampleOutput: string;
  safetyNotes: string;
  visibility: "private" | "public";
  status: "draft" | "published";
};

const initialDraft: PromptDraftState = {
  title: "",
  categoryId: "",
  useCase: "",
  promptBody: "",
  exampleInput: "",
  exampleOutput: "",
  safetyNotes: "",
  visibility: "private",
  status: "draft",
};

export default function PromptForm({ isLoggedIn }: PromptFormProps) {
  const [state, formAction] = useActionState(createPromptAction, initialState);
  const [step, setStep] = useState<PromptFormStep>("core");
  const [draft, setDraft] = useState<PromptDraftState>(initialDraft);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  function openLoginDialog() {
    setIsLoginDialogOpen(true);
  }

  function updateDraft<Key extends keyof PromptDraftState>(
    key: Key,
    value: PromptDraftState[Key],
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (isLoggedIn) {
      return;
    }

    event.preventDefault();
    openLoginDialog();
  }

  const canGoNextFromCore =
    draft.title.trim().length > 0 && draft.promptBody.trim().length > 0;

  return (
    <>
      <div className="relative">
        {!isLoggedIn ? (
          <button
            type="button"
            className="absolute inset-0 z-10 cursor-pointer rounded-2xl bg-transparent"
            aria-label="로그인 안내 열기"
            onClick={openLoginDialog}
          />
        ) : null}

        <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="title" value={draft.title} />
          <input type="hidden" name="categoryId" value={draft.categoryId} />
          <input type="hidden" name="useCase" value={draft.useCase} />
          <input type="hidden" name="promptBody" value={draft.promptBody} />
          <input type="hidden" name="exampleInput" value={draft.exampleInput} />
          <input type="hidden" name="exampleOutput" value={draft.exampleOutput} />
          <input type="hidden" name="safetyNotes" value={draft.safetyNotes} />
          <input type="hidden" name="visibility" value={draft.visibility} />
          <input type="hidden" name="status" value={draft.status} />

          <PromptFormStepTabs currentStep={step} onStepChange={setStep} />

          {step === "core" ? (
            <PromptCoreFields
              draft={draft}
              limits={FIELD_LIMITS}
              onChange={updateDraft}
            />
          ) : null}

          {step === "settings" ? (
            <div className="space-y-4">
              <PromptPublishFields draft={draft} onChange={updateDraft} />
              <PromptOptionalFields
                draft={draft}
                limits={FIELD_LIMITS}
                onChange={updateDraft}
              />
            </div>
          ) : null}

          {!state.ok ? <ErrorMessage message={state.message} /> : null}

          <PromptFormActions
            currentStep={step}
            canGoNextFromCore={canGoNextFromCore}
            onStepChange={setStep}
          />
        </form>
      </div>

      <LoginRequiredDialog
        isOpen={isLoginDialogOpen}
        title="로그인이 필요한 기능입니다"
        description="프롬프트를 작성하거나 저장하면 내용과 설정이 개인 계정에 연결됩니다. 저장한 프롬프트를 다시 확인하고 관리하려면 로그인이 필요합니다."
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </>
  );
}