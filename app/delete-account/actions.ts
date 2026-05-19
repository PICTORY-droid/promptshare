"use server";

import { getCurrentUser } from "@/server/auth/get-current-user";
import { createSupabaseAdminClient } from "@/server/db/supabase-admin";

export type DeleteAccountActionState = {
  ok: boolean;
  message: string;
};

const initialDeleteErrorMessage =
  "계정 탈퇴 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

export async function deleteAccountAction(): Promise<DeleteAccountActionState> {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    return {
      ok: false,
      message: "계정 탈퇴는 로그인 후 진행할 수 있습니다.",
    };
  }

  const userId = currentUser.user.id;
  const supabaseAdmin = createSupabaseAdminClient();

  const { error: safeCheckDeleteError } = await supabaseAdmin
    .from("promptlab_safecheck_reports")
    .delete()
    .eq("user_id", userId);

  if (safeCheckDeleteError) {
    return {
      ok: false,
      message: initialDeleteErrorMessage,
    };
  }

  const { error: promptsDeleteError } = await supabaseAdmin
    .from("promptlab_prompts")
    .delete()
    .eq("user_id", userId);

  if (promptsDeleteError) {
    return {
      ok: false,
      message: initialDeleteErrorMessage,
    };
  }

  const { error: authDeleteError } =
    await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authDeleteError) {
    return {
      ok: false,
      message: initialDeleteErrorMessage,
    };
  }

  return {
    ok: true,
    message: "계정과 저장 데이터가 삭제되었습니다.",
  };
}