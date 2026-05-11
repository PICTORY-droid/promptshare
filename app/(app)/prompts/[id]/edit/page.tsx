import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { getCategories } from "@/features/prompts/server/get-categories";
import { getPrompt } from "@/features/prompts/server/get-prompt";
import PromptEditForm from "./_components/PromptEditForm.client";

type PromptEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PromptEditPage({ params }: PromptEditPageProps) {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  const { id } = await params;
  const promptResult = await getPrompt(id);

  if (!promptResult.ok) {
    notFound();
  }

  if (promptResult.prompt.userId !== currentUser.user.id) {
    notFound();
  }

  const categoriesResult = await getCategories();

  return (
    <PromptEditForm
      email={currentUser.user.email ?? "로그인 사용자"}
      prompt={promptResult.prompt}
      categories={categoriesResult.ok ? categoriesResult.categories : []}
      categoryLoadMessage={categoriesResult.ok ? null : categoriesResult.message}
    />
  );
}
