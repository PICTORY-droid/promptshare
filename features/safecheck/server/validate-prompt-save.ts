import { PROMPT_STATUS } from "../../prompts/constants/prompt-status";
import { PROMPT_VISIBILITY } from "../../prompts/constants/prompt-visibility";
import type { PromptStatus } from "../../prompts/constants/prompt-status";
import type { PromptVisibility } from "../../prompts/constants/prompt-visibility";
import { scanPrompt } from "./scan-prompt";

export type ValidatePromptSaveInput = {
  promptBody: string;
  visibility: PromptVisibility;
  status: PromptStatus;
};

export type ValidatePromptSaveResult =
  | {
      ok: true;
      message: null;
    }
  | {
      ok: false;
      message: string;
    };

export function validatePromptSave(
  input: ValidatePromptSaveInput,
): ValidatePromptSaveResult {
  const scanResult = scanPrompt(input.promptBody);

  if (scanResult.level === "block") {
    return {
      ok: false,
      message:
        "AI SafeCheck 차단 판정입니다. 개인정보, 회사기밀, 계약정보, 저작권 위험, 과장 표현을 제거한 뒤 다시 저장하세요.",
    };
  }

  const isPublicOrPublished =
    input.visibility === PROMPT_VISIBILITY.PUBLIC ||
    input.status === PROMPT_STATUS.PUBLISHED;

  if (scanResult.level === "review" && isPublicOrPublished) {
    return {
      ok: false,
      message:
        "AI SafeCheck 검토 필요 판정입니다. 먼저 비공개, 초안으로 저장하거나 위험 표현을 수정한 뒤 공개, 게시로 변경하세요.",
    };
  }

  return {
    ok: true,
    message: null,
  };
}
