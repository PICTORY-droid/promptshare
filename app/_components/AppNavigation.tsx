"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  const authHref = isLoggedIn ? "/logout" : "/login";
  const authLabel = isLoggedIn ? "로그아웃" : "로그인";

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        메뉴
      </button>

      <nav className="hidden items-center justify-end gap-2 text-sm font-semibold text-slate-600 md:flex">
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
          <span className="hidden max-w-48 truncate rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-500 xl:inline">
            {email}
          </span>
        ) : null}

        <Link
          href={authHref}
          className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-950"
        >
          {authLabel}
        </Link>
      </nav>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="absolute right-0 top-12 z-50 w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl md:hidden"
        >
          {email ? (
            <div className="mb-2 rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">
                로그인 계정
              </p>
              <p className="mt-1 break-all text-sm font-bold text-slate-900">
                {email}
              </p>
            </div>
          ) : null}

          <div className="grid gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href={authHref}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              onClick={() => setIsOpen(false)}
            >
              {authLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
