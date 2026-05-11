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

export type GetPromptsResult =
  | {
      ok: true;
      prompts: Prompt[];
      message: null;
    }
  | {
      ok: false;
      prompts: [];
      message: string;
    };

export async function getPublicPrompts(): Promise<GetPromptsResult> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("promptlab_prompts")
    .select(PROMPT_SELECT_COLUMNS)
    .eq("visibility", "public")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      prompts: [],
      message: error.message,
    };
  }

  return {
    ok: true,
    prompts: ((data ?? []) as PromptRow[]).map(mapPromptRowToPrompt),
    message: null,
  };
}

export async function getOwnPrompts(userId: string): Promise<GetPromptsResult> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("promptlab_prompts")
    .select(PROMPT_SELECT_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      ok: false,
      prompts: [],
      message: error.message,
    };
  }

  return {
    ok: true,
    prompts: ((data ?? []) as PromptRow[]).map(mapPromptRowToPrompt),
    message: null,
  };
}
