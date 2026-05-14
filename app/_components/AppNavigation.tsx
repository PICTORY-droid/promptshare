"use client";

import { useState } from "react";
import LinkButton from "@/shared/ui/link-button";

const navigationItems = [
  { href: "/", label: "홈" },
  { href: "/dashboard", label: "대시보드" },
  { href: "/write", label: "작성" },
  { href: "/check", label: "검사" },
  { href: "/reports", label: "기록" },
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

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-150 ease-out hover:bg-slate-50 active:scale-[0.98] active:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 md:hidden"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        메뉴
      </button>

      <nav className="hidden items-center justify-end gap-2 text-sm font-semibold text-slate-600 md:flex">
        {navigationItems.map((item) => (
          <LinkButton key={item.href} href={item.href}>
            {item.label}
          </LinkButton>
        ))}

        {email ? (
          <span className="hidden max-w-48 truncate rounded-full bg-slate-100 px-4 py-2 text-xs text-slate-500 xl:inline">
            {email}
          </span>
        ) : null}

        {isLoggedIn ? (
          <LinkButton href="/logout" useAnchor>
            로그아웃
          </LinkButton>
        ) : (
          <LinkButton href="/login">로그인</LinkButton>
        )}
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
              <LinkButton
                key={item.href}
                href={item.href}
                size="md"
                className="justify-start"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </LinkButton>
            ))}

            {isLoggedIn ? (
              <LinkButton
                href="/logout"
                size="md"
                className="justify-start"
                useAnchor
              >
                로그아웃
              </LinkButton>
            ) : (
              <LinkButton
                href="/login"
                size="md"
                className="justify-start"
                onClick={() => setIsOpen(false)}
              >
                로그인
              </LinkButton>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
