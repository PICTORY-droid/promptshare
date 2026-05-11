import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type LinkButtonVariant = "default" | "secondary" | "ghost";
type LinkButtonSize = "sm" | "md";

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: LinkButtonVariant;
  size?: LinkButtonSize;
  useAnchor?: boolean;
};

const variantClassName: Record<LinkButtonVariant, string> = {
  default:
    "bg-slate-950 text-white shadow-sm hover:bg-slate-800 active:bg-slate-900",
  secondary:
    "bg-slate-100 text-slate-950 hover:bg-slate-200 active:bg-slate-300",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950 active:bg-slate-200",
};

const sizeClassName: Record<LinkButtonSize, string> = {
  sm: "min-h-10 rounded-full px-4 py-2 text-sm",
  md: "min-h-11 rounded-2xl px-4 py-3 text-sm",
};

export default function LinkButton({
  href,
  children,
  className,
  variant = "ghost",
  size = "sm",
  useAnchor = false,
  ...props
}: LinkButtonProps) {
  const composedClassName = cn(
    "inline-flex items-center justify-center font-semibold",
    "transition duration-150 ease-out",
    "active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200",
    variantClassName[variant],
    sizeClassName[size],
    className,
  );

  if (useAnchor) {
    return (
      <a href={href} className={composedClassName} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={composedClassName} {...props}>
      {children}
    </Link>
  );
}
