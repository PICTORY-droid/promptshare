import type { Prompt } from "@/features/prompts/types/prompt.types";
import DashboardPromptCard from "./DashboardPromptCard";

type DashboardPromptGridProps = {
  prompts: Prompt[];
};

export default function DashboardPromptGrid({
  prompts,
}: DashboardPromptGridProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <DashboardPromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}