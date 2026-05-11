import { createSupabaseServerClient } from "../../../server/db/supabase-server";
import type { SafeCheckResult } from "../types/safecheck.types";

export type CreateSafeCheckReportInput = {
  userId: string;
  promptId?: string | null;
  result: SafeCheckResult;
};

export type CreateSafeCheckReportResult =
  | {
      ok: true;
      reportId: string;
      message: null;
    }
  | {
      ok: false;
      reportId: null;
      message: string;
    };

export async function createSafeCheckReport(
  input: CreateSafeCheckReportInput,
): Promise<CreateSafeCheckReportResult> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("promptlab_safecheck_reports")
    .insert({
      user_id: input.userId,
      prompt_id: input.promptId ?? null,
      score: input.result.score,
      level: input.result.level,
      risk_categories: input.result.findings.map((finding) => finding.category),
      safe_prompt: input.result.safePrompt,
      policy_version: input.result.metadata.policyVersion,
      detector_version: input.result.metadata.detectorVersion,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      reportId: null,
      message: error?.message ?? "SafeCheck 리포트 저장에 실패했습니다.",
    };
  }

  return {
    ok: true,
    reportId: data.id as string,
    message: null,
  };
}
