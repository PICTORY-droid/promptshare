"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { createPrompt } from "@/features/prompts/server/create-prompt";
import { PROMPT_STATUS } from "@/features/prompts/constants/prompt-status";
import { PROMPT_VISIBILITY } from "@/features/prompts/constants/prompt-visibility";
import { validatePromptSave } from "@/features/safecheck/server/validate-prompt-save";

export type CreatePromptActionState = {
  ok: boolean;
  message: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getNullableStringValue(formData: FormData, key: string) {
  const value = getStringValue(formData, key);
  return value.length > 0 ? value : null;
}

export async function createPromptAction(
  _previousState: CreatePromptActionState,
  formData: FormData,
): Promise<CreatePromptActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    return {
      ok: false,
      message: "로그인이 필요합니다.",
    };
  }

  const visibilityValue = getStringValue(formData, "visibility");
  const statusValue = getStringValue(formData, "status");

  const visibility =
    visibilityValue === PROMPT_VISIBILITY.PUBLIC
      ? PROMPT_VISIBILITY.PUBLIC
      : PROMPT_VISIBILITY.PRIVATE;

  const status =
    statusValue === PROMPT_STATUS.PUBLISHED
      ? PROMPT_STATUS.PUBLISHED
      : PROMPT_STATUS.DRAFT;

  const promptBody = getStringValue(formData, "promptBody");

  const saveValidation = validatePromptSave({
    promptBody,
    visibility,
    status,
  });

  if (!saveValidation.ok) {
    return {
      ok: false,
      message: saveValidation.message,
    };
  }

  const result = await createPrompt(currentUser.user.id, {
    categoryId: getNullableStringValue(formData, "categoryId"),
    title: getStringValue(formData, "title"),
    useCase: getNullableStringValue(formData, "useCase"),
    promptBody,
    exampleInput: getNullableStringValue(formData, "exampleInput"),
    exampleOutput: getNullableStringValue(formData, "exampleOutput"),
    safetyNotes: getNullableStringValue(formData, "safetyNotes"),
    visibility,
    status,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  redirect(`/prompts/${result.prompt.id}`);
}
