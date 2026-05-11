import { createSupabaseServerClient } from "../../../server/db/supabase-server";
import { promptUpdateSchema } from "../schemas/prompt.schema";
import {
  mapPromptRowToPrompt,
  type Prompt,
  type PromptRow,
  type PromptUpdateInput,
} from "../types/prompt.types";

export type UpdatePromptResult =
  | {
      ok: true;
      prompt: Prompt;
      message: null;
    }
  | {
      ok: false;
      prompt: null;
      message: string;
    };

export async function updatePrompt(
  userId: string,
  promptId: string,
  input: PromptUpdateInput,
): Promise<UpdatePromptResult> {
  const parsed = promptUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      prompt: null,
      message: parsed.error.issues[0]?.message ?? "프롬프트 수정값이 올바르지 않습니다.",
    };
  }

  const updatePayload: Record<string, unknown> = {};

  if ("categoryId" in parsed.data) {
    updatePayload.category_id = parsed.data.categoryId ?? null;
  }

  if ("title" in parsed.data) {
    updatePayload.title = parsed.data.title;
  }

  if ("useCase" in parsed.data) {
    updatePayload.use_case = parsed.data.useCase ?? null;
  }

  if ("promptBody" in parsed.data) {
    updatePayload.prompt_body = parsed.data.promptBody;
  }

  if ("variables" in parsed.data) {
    updatePayload.variables = parsed.data.variables;
  }

  if ("exampleInput" in parsed.data) {
    updatePayload.example_input = parsed.data.exampleInput ?? null;
  }

  if ("exampleOutput" in parsed.data) {
    updatePayload.example_output = parsed.data.exampleOutput ?? null;
  }

  if ("safetyNotes" in parsed.data) {
    updatePayload.safety_notes = parsed.data.safetyNotes ?? null;
  }

  if ("visibility" in parsed.data) {
    updatePayload.visibility = parsed.data.visibility;
  }

  if ("status" in parsed.data) {
    updatePayload.status = parsed.data.status;
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("promptlab_prompts")
    .update(updatePayload)
    .eq("id", promptId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data) {
    return {
      ok: false,
      prompt: null,
      message: error?.message ?? "프롬프트 수정에 실패했습니다.",
    };
  }

  return {
    ok: true,
    prompt: mapPromptRowToPrompt(data as PromptRow),
    message: null,
  };
}
