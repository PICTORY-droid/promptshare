import { PROMPT_STATUS } from "../constants/prompt-status";
import { updatePrompt, type UpdatePromptResult } from "./update-prompt";

export async function deletePrompt(
  userId: string,
  promptId: string,
): Promise<UpdatePromptResult> {
  return updatePrompt(userId, promptId, {
    status: PROMPT_STATUS.ARCHIVED,
  });
}
