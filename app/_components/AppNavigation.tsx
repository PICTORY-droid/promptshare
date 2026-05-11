import Link from "next/link";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/dashboard", label: "대시보드" },
  { href: "/write", label: "작성" },
  { href: "/safecheck", label: "SafeCheck" },
  { href: "/admin", label: "관리자" },
  { href: "/reports", label: "리포트" },
];

type AppNavigationProps = {
  isLoggedIn: boolean;
  email: string | null;
};

export default function AppNavigation({
  isLoggedIn,
  email,
}: AppNavigationProps) {
  return (
    <nav className="flex flex-wrap items-center justify-end gap-2 text-sm font-semibold text-slate-600">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950"
        >
          {item.label}
        </Link>
      ))}

      {email ? (
        <span className="hidden max-w-48 truncate rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-500 lg:inline">
          {email}
        </span>
      ) : null}

      {isLoggedIn ? (
        <Link
          href="/logout"
          className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950"
        >
          로그아웃
        </Link>
      ) : (
        <Link
          href="/login"
          className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950"
        >
          로그인
        </Link>
      )}
    </nav>
  );
}
