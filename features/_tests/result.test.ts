import { describe, expect, it } from "vitest";
import {
  createFailureResult,
  createSuccessResult,
  isFailureResult,
  isSuccessResult,
} from "@/shared/lib/result";

describe("ActionResult helpers", () => {
  it("creates a success result", () => {
    const result = createSuccessResult({ id: "prompt-1" });

    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ id: "prompt-1" });
    expect(result.message).toBeNull();
    expect(isSuccessResult(result)).toBe(true);
    expect(isFailureResult(result)).toBe(false);
  });

  it("creates a failure result", () => {
    const result = createFailureResult("저장에 실패했습니다.", "SAVE_FAILED");

    expect(result.ok).toBe(false);
    expect(result.data).toBeNull();
    expect(result.message).toBe("저장에 실패했습니다.");
    expect(result.code).toBe("SAVE_FAILED");
    expect(isSuccessResult(result)).toBe(false);
    expect(isFailureResult(result)).toBe(true);
  });
});