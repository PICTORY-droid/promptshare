import type { Prompt } from "@/features/prompts/types/prompt.types";
import PromptCard from "./PromptCard";

type PromptListProps = {
  prompts: Prompt[];
};

export default function PromptList({ prompts }: PromptListProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {prompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
}
