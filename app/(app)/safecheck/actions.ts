"use server";

import { getCurrentUser } from "@/server/auth/get-current-user";
import { scanPrompt } from "@/features/safecheck/server/scan-prompt";
import { createSafeCheckReport } from "@/features/safecheck/server/create-safecheck-report";
import type { SafeCheckResult } from "@/features/safecheck/types/safecheck.types";

export type SafeCheckActionState = {
  ok: boolean;
  message: string;
  result: SafeCheckResult | null;
  reportId: string | null;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function scanPromptAction(
  _previousState: SafeCheckActionState,
  formData: FormData,
): Promise<SafeCheckActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    return {
      ok: false,
      message: "로그인이 필요합니다.",
      result: null,
      reportId: null,
    };
  }

  const promptText = getStringValue(formData, "promptText");

  if (!promptText) {
    return {
      ok: false,
      message: "검사할 프롬프트 본문을 입력하세요.",
      result: null,
      reportId: null,
    };
  }

  if (promptText.length > 12000) {
    return {
      ok: false,
      message: "프롬프트 본문은 최대 12,000자까지 검사할 수 있습니다.",
      result: null,
      reportId: null,
    };
  }

  const result = scanPrompt(promptText);
  const reportResult = await createSafeCheckReport({
    userId: currentUser.user.id,
    result,
  });

  if (!reportResult.ok) {
    return {
      ok: false,
      message: reportResult.message,
      result,
      reportId: null,
    };
  }

  return {
    ok: true,
    message: "검사가 완료되고 리포트가 저장되었습니다.",
    result,
    reportId: reportResult.data.reportId,
  };
}