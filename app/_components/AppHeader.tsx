import { unstable_noStore as noStore } from "next/cache";
import { getCurrentUser } from "@/server/auth/get-current-user";
import AppLogo from "./AppLogo";
import DesktopTopNavigation from "./DesktopTopNavigation";
import HeaderAuthAction from "./HeaderAuthAction";

export default async function AppHeader() {
  noStore();

  const currentUser = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-4">
        <AppLogo />
        <DesktopTopNavigation isLoggedIn={currentUser.ok} />
        <HeaderAuthAction isLoggedIn={currentUser.ok} />
      </div>
    </header>
  );
}