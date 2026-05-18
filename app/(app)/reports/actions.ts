"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { deleteSafeCheckReport } from "@/features/safecheck/server/delete-safecheck-report";

export type DeleteReportActionState = {
  ok: boolean;
  message: string;
};

export async function deleteReportAction(
  reportId: string,
): Promise<DeleteReportActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    return {
      ok: false,
      message: "로그인이 필요합니다.",
    };
  }

  if (!reportId) {
    return {
      ok: false,
      message: "삭제할 기록을 찾지 못했습니다.",
    };
  }

  const result = await deleteSafeCheckReport({
    userId: currentUser.user.id,
    reportId,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  revalidatePath("/reports");
  revalidatePath("/dashboard");

  return {
    ok: true,
    message: "검사 기록을 삭제했습니다.",
  };
}