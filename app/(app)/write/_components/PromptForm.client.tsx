"use client";

import { useActionState, useState } from "react";
import type { PromptCategory } from "@/features/prompts/types/category.types";
import { createPromptAction, type CreatePromptActionState } from "../actions";
import ErrorMessage from "@/shared/ui/error-message";
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

export default function PromptForm({
  categories,
  categoryLoadMessage,
}: PromptFormProps) {
  const [state, formAction] = useActionState(createPromptAction, initialState);
  const [step, setStep] = useState<PromptFormStep>("core");
  const [draft, setDraft] = useState<PromptDraftState>(initialDraft);

  function updateDraft<Key extends keyof PromptDraftState>(
    key: Key,
    value: PromptDraftState[Key],
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const canGoNextFromCore =
    draft.title.trim().length > 0 && draft.promptBody.trim().length > 0;

  return (
    <form action={formAction} className="space-y-4">
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
            categories={categories}
            categoryLoadMessage={categoryLoadMessage}
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
  );
}