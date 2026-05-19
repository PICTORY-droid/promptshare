import { getCurrentUser } from "@/server/auth/get-current-user";
import DeleteAccountShell from "./_components/DeleteAccountShell";

export default async function DeleteAccountPage() {
  const currentUser = await getCurrentUser();

  return <DeleteAccountShell isLoggedIn={currentUser.ok} />;
}