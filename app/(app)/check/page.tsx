import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import CheckShell from "./_components/CheckShell";

export default async function CheckPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  return (
    <CheckShell
      email={currentUser.user.email ?? "로그인 사용자"}
    />
  );
}
