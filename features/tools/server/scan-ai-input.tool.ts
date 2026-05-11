import { scanPrompt } from "../../safecheck/server/scan-prompt";
import type {
  ScanAiInputToolInput,
  ScanAiInputToolOutput,
  ToolDefinition,
} from "../types";

function buildSummary(output: {
  level: string;
  score: number;
  findingCount: number;
}) {
  if (output.findingCount === 0) {
    return "탐지된 위험 요소가 없습니다. 공개 전 최종 문맥 검토를 권장합니다.";
  }

  if (output.level === "block") {
    return "차단 수준의 위험 요소가 탐지되었습니다. 원문 저장이나 공개 전에 반드시 수정해야 합니다.";
  }

  if (output.level === "review") {
    return "검토가 필요한 위험 요소가 탐지되었습니다. 비공개 초안으로만 저장하고 공개 전 수정이 필요합니다.";
  }

  return "낮은 수준의 위험 요소가 탐지되었습니다. 공개 전 표현을 한 번 더 확인하세요.";
}

export const scanAiInputTool: ToolDefinition<
  ScanAiInputToolInput,
  ScanAiInputToolOutput
> = {
  name: "scan_ai_input",
  description:
    "사용자가 입력한 프롬프트를 SafeCheck 룰 기반 엔진으로 검사하고 위험 점수, 판정, 수정 안내를 반환합니다.",
  inputSchemaDescription:
    "text 필드에 검사할 프롬프트 본문을 문자열로 전달합니다. 원문은 저장하지 않습니다.",
  execute(input) {
    const result = scanPrompt(input.text);

    const riskCategories = result.findings.map((finding) => finding.category);

    return {
      toolName: "scan_ai_input",
      summary: buildSummary({
        level: result.level,
        score: result.score,
        findingCount: result.findings.length,
      }),
      level: result.level,
      score: result.score,
      riskCategories,
      findingCount: result.findings.length,
      safePrompt: result.safePrompt,
      metadata: {
        policyVersion: result.metadata.policyVersion,
        detectorVersion: result.metadata.detectorVersion,
        llmUsed: false,
        originalTextStored: false,
      },
    };
  },
};
