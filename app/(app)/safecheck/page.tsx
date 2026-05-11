import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import SafeCheckShell from "./_components/SafeCheckShell";

export default async function SafeCheckPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  return (
    <SafeCheckShell
      email={currentUser.user.email ?? "로그인 사용자"}
      userId={currentUser.user.id}
    />
  );
}
