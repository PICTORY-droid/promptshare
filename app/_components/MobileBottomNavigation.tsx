"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const bottomNavigationItems = [
  {
    href: "/",
    label: "홈",
    match: (pathname: string) => pathname === "/",
  },
  {
    href: "/write",
    label: "작성",
    match: (pathname: string) =>
      pathname === "/write" || pathname.startsWith("/prompts"),
  },
  {
    href: "/check",
    label: "검사",
    match: (pathname: string) =>
      pathname === "/check" || pathname.startsWith("/safecheck"),
  },
  {
    href: "/reports",
    label: "기록",
    match: (pathname: string) => pathname.startsWith("/reports"),
  },
];

export default function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {bottomNavigationItems.map((item) => {
          const isActive = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "rounded-2xl border border-slate-300 bg-slate-100 px-2 py-2 text-center text-xs font-bold text-slate-950"
                  : "rounded-2xl px-2 py-2 text-center text-xs font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}