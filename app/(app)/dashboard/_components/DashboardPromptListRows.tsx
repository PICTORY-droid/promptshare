import type { Prompt } from "@/features/prompts/types/prompt.types";
import DashboardPromptRow from "./DashboardPromptRow";

type DashboardPromptListRowsProps = {
  prompts: Prompt[];
};

export default function DashboardPromptListRows({
  prompts,
}: DashboardPromptListRowsProps) {
  return (
    <div className="grid gap-2">
      {prompts.map((prompt) => (
        <DashboardPromptRow key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}