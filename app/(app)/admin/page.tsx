import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/get-current-user";
import AdminShell from "./_components/AdminShell";

export default async function AdminPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser.ok) {
    redirect("/login");
  }

  return (
    <AdminShell
      email={currentUser.user.email ?? "로그인 사용자"}
      userId={currentUser.user.id}
    />
  );
}
