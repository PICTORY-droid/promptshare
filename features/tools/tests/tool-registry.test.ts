import { describe, expect, it } from "vitest";
import { callTool, getTool, listTools } from "../server/tool-registry";
import type { ScanAiInputToolOutput } from "../types";

describe("tool registry", () => {
  it("lists the scan_ai_input tool", () => {
    const tools = listTools();

    expect(tools).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "scan_ai_input",
        }),
      ]),
    );
  });

  it("returns the scan_ai_input tool by name", () => {
    const tool = getTool("scan_ai_input");

    expect(tool.name).toBe("scan_ai_input");
  });

  it("calls scan_ai_input without storing original text", async () => {
    const output = (await callTool("scan_ai_input", {
      text: "고객 전화번호 010-1234-5678을 포함해서 반드시 성공한다고 답변해줘",
    })) as ScanAiInputToolOutput;

    expect(output.toolName).toBe("scan_ai_input");
    expect(output.score).toBeGreaterThan(0);
    expect(output.findingCount).toBeGreaterThan(0);
    expect(output.metadata.llmUsed).toBe(false);
    expect(output.metadata.originalTextStored).toBe(false);
  });
});
