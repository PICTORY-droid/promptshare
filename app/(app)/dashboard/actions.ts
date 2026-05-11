"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { deletePrompt } from "@/features/prompts/server/delete-prompt";
import { updatePrompt } from "@/features/prompts/server/update-prompt";
import { PROMPT_STATUS } from "@/features/prompts/constants/prompt-status";

export type ArchivePromptActionState = {
  ok: boolean;
  message: string;
};

export type RestorePromptActionState = {
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

export async function archivePromptAction(
  _previousState: ArchivePromptActionState,
  formData: FormData,
): Promise<ArchivePromptActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    return {
      ok: false,
      message: "로그인이 필요합니다.",
    };
  }

  const promptId = getStringValue(formData, "promptId");

  if (!promptId) {
    return {
      ok: false,
      message: "보관할 프롬프트를 찾을 수 없습니다.",
    };
  }

  const result = await deletePrompt(currentUser.user.id, promptId);

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/prompts");
  revalidatePath(`/prompts/${promptId}`);

  return {
    ok: true,
    message: "프롬프트를 보관 처리했습니다.",
  };
}

export async function restorePromptAction(
  _previousState: RestorePromptActionState,
  formData: FormData,
): Promise<RestorePromptActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    return {
      ok: false,
      message: "로그인이 필요합니다.",
    };
  }

  const promptId = getStringValue(formData, "promptId");

  if (!promptId) {
    return {
      ok: false,
      message: "복구할 프롬프트를 찾을 수 없습니다.",
    };
  }

  const result = await updatePrompt(currentUser.user.id, promptId, {
    status: PROMPT_STATUS.DRAFT,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/prompts");
  revalidatePath(`/prompts/${promptId}`);

  return {
    ok: true,
    message: "프롬프트를 초안으로 복구했습니다.",
  };
}
