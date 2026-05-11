import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import { getCategories } from "@/features/prompts/server/get-categories";
import WriteShell from "./_components/WriteShell";

export default async function WritePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  const categoriesResult = await getCategories();

  return (
    <WriteShell
      email={currentUser.user.email ?? "로그인 사용자"}
      categories={categoriesResult.ok ? categoriesResult.categories : []}
      categoryLoadMessage={categoriesResult.ok ? null : categoriesResult.message}
    />
  );
}
