import LinkButton from "@/shared/ui/link-button";

const desktopNavigationItems = [
  { href: "/", label: "홈" },
  { href: "/dashboard", label: "대시보드" },
  { href: "/write", label: "작성" },
  { href: "/check", label: "검사" },
  { href: "/reports", label: "기록" },
];

type DesktopTopNavigationProps = {
  isLoggedIn: boolean;
};

export default function DesktopTopNavigation({
  isLoggedIn,
}: DesktopTopNavigationProps) {
  return (
    <nav className="hidden items-center justify-end gap-2 text-sm font-semibold text-slate-600 md:flex">
      {desktopNavigationItems.map((item) => (
        <LinkButton key={item.href} href={item.href}>
          {item.label}
        </LinkButton>
      ))}

      {isLoggedIn ? (
        <LinkButton href="/logout" useAnchor>
          로그아웃
        </LinkButton>
      ) : (
        <LinkButton href="/login">로그인</LinkButton>
      )}
    </nav>
  );
}