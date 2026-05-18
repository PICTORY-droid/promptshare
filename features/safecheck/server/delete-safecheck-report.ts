import { createSupabaseServerClient } from "../../../server/db/supabase-server";
import type { EmptyActionResult } from "@/shared/lib/result";

export type DeleteSafeCheckReportInput = {
  userId: string;
  reportId: string;
};

export async function deleteSafeCheckReport({
  userId,
  reportId,
}: DeleteSafeCheckReportInput): Promise<EmptyActionResult> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("promptlab_safecheck_reports")
    .delete()
    .eq("id", reportId)
    .eq("user_id", userId);

  if (error) {
    return {
      ok: false,
      data: null,
      message: error.message || "검사 기록 삭제에 실패했습니다.",
    };
  }

  return {
    ok: true,
    data: null,
    message: null,
  };
}