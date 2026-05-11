export type ToolName = "scan_ai_input";

export type ToolDefinition<TInput = unknown, TOutput = unknown> = {
  name: ToolName;
  description: string;
  inputSchemaDescription: string;
  execute: (input: TInput) => Promise<TOutput> | TOutput;
};

export type ToolRegistryItem = {
  name: ToolName;
  description: string;
  inputSchemaDescription: string;
};

export type ScanAiInputToolInput = {
  text: string;
};

export type ScanAiInputToolOutput = {
  toolName: ToolName;
  summary: string;
  level: string;
  score: number;
  riskCategories: string[];
  findingCount: number;
  safePrompt: string;
  metadata: {
    policyVersion: string;
    detectorVersion: string;
    llmUsed: false;
    originalTextStored: false;
  };
};
