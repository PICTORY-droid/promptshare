import { createSupabaseServerClient } from "../../../server/db/supabase-server";
import { promptCreateSchema } from "../schemas/prompt.schema";
import {
  mapPromptRowToPrompt,
  type Prompt,
  type PromptCreateInput,
  type PromptRow,
} from "../types/prompt.types";

export type CreatePromptResult =
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

export async function createPrompt(
  userId: string,
  input: PromptCreateInput,
): Promise<CreatePromptResult> {
  const parsed = promptCreateSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      prompt: null,
      message: parsed.error.issues[0]?.message ?? "프롬프트 입력값이 올바르지 않습니다.",
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("promptlab_prompts")
    .insert({
      user_id: userId,
      category_id: parsed.data.categoryId ?? null,
      title: parsed.data.title,
      use_case: parsed.data.useCase ?? null,
      prompt_body: parsed.data.promptBody,
      variables: parsed.data.variables,
      example_input: parsed.data.exampleInput ?? null,
      example_output: parsed.data.exampleOutput ?? null,
      safety_notes: parsed.data.safetyNotes ?? null,
      visibility: parsed.data.visibility,
      status: parsed.data.status,
    })
    .select()
    .single();

  if (error || !data) {
    return {
      ok: false,
      prompt: null,
      message: error?.message ?? "프롬프트 저장에 실패했습니다.",
    };
  }

  return {
    ok: true,
    prompt: mapPromptRowToPrompt(data as PromptRow),
    message: null,
  };
}
