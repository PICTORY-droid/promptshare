import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import WriteShell from "./_components/WriteShell";

export default async function WritePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  return (
    <WriteShell
      email={currentUser.user.email ?? "로그인 사용자"}
      userId={currentUser.user.id}
    />
  );
}
