import { createSupabaseServerClient } from "../../../server/db/supabase-server";
import {
  mapPromptRowToPrompt,
  type Prompt,
  type PromptRow,
} from "../types/prompt.types";

const PROMPT_SELECT_COLUMNS = `
  id,
  user_id,
  category_id,
  title,
  use_case,
  prompt_body,
  variables,
  example_input,
  example_output,
  safety_notes,
  visibility,
  status,
  created_at,
  updated_at
`;

export type GetPromptResult =
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

export async function getPrompt(promptId: string): Promise<GetPromptResult> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("promptlab_prompts")
    .select(PROMPT_SELECT_COLUMNS)
    .eq("id", promptId)
    .single();

  if (error || !data) {
    return {
      ok: false,
      prompt: null,
      message: error?.message ?? "프롬프트를 찾을 수 없습니다.",
    };
  }

  return {
    ok: true,
    prompt: mapPromptRowToPrompt(data as PromptRow),
    message: null,
  };
}
