import { describe, expect, it } from "vitest";
import { PROMPT_STATUS } from "../../prompts/constants/prompt-status";
import { PROMPT_VISIBILITY } from "../../prompts/constants/prompt-visibility";
import { validatePromptSave } from "../server/validate-prompt-save";

describe("validatePromptSave", () => {
  it("allows a safe public published prompt", () => {
    const result = validatePromptSave({
      promptBody: "고객 문의 내용을 정중한 이메일 답변으로 바꿔주세요.",
      visibility: PROMPT_VISIBILITY.PUBLIC,
      status: PROMPT_STATUS.PUBLISHED,
    });

    expect(result.ok).toBe(true);
  });

  it("allows a review prompt as private draft", () => {
    const result = validatePromptSave({
      promptBody: "고객 전화번호 010-1234-5678을 포함한 메시지를 정리하세요.",
      visibility: PROMPT_VISIBILITY.PRIVATE,
      status: PROMPT_STATUS.DRAFT,
    });

    expect(result.ok).toBe(true);
  });

  it("rejects a review prompt when public", () => {
    const result = validatePromptSave({
      promptBody: "고객 전화번호 010-1234-5678을 포함한 메시지를 정리하세요.",
      visibility: PROMPT_VISIBILITY.PUBLIC,
      status: PROMPT_STATUS.DRAFT,
    });

    expect(result.ok).toBe(false);
  });

  it("rejects a blocked prompt", () => {
    const result = validatePromptSave({
      promptBody:
        "내부 자료와 영업비밀을 사용하고, 010-1234-5678 고객에게 반드시 성공한다고 안내하세요.",
      visibility: PROMPT_VISIBILITY.PRIVATE,
      status: PROMPT_STATUS.DRAFT,
    });

    expect(result.ok).toBe(false);
  });
});
