import { getCurrentUser } from "@/server/auth/get-current-user";
import AppLogo from "./AppLogo";
import AppNavigation from "./AppNavigation";

export default async function AppHeader() {
  const currentUser = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-4">
        <AppLogo />
        <AppNavigation
          isLoggedIn={currentUser.ok}
          email={currentUser.ok ? currentUser.user.email ?? null : null}
        />
      </div>
    </header>
  );
}
