import { scanAiInputTool } from "./scan-ai-input.tool";
import type {
  ToolName,
  ToolRegistryItem,
} from "../types";

type ExecutableTool = {
  name: ToolName;
  description: string;
  inputSchemaDescription: string;
  execute: (input: unknown) => unknown | Promise<unknown>;
};

const tools: Record<ToolName, ExecutableTool> = {
  scan_ai_input: {
    ...scanAiInputTool,
    execute: (input: unknown) => scanAiInputTool.execute(input as never),
  },
};

export function listTools(): ToolRegistryItem[] {
  return Object.values(tools).map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchemaDescription: tool.inputSchemaDescription,
  }));
}

export function getTool(name: ToolName) {
  return tools[name];
}

export async function callTool<TInput>(name: ToolName, input: TInput) {
  const tool = getTool(name);

  return tool.execute(input);
}
