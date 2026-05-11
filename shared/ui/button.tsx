import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type ButtonVariant = "default" | "secondary" | "ghost" | "danger" | "success";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClassName: Record<ButtonVariant, string> = {
  default:
    "bg-slate-950 text-white shadow-sm hover:bg-slate-800 active:bg-slate-900",
  secondary:
    "bg-slate-100 text-slate-950 hover:bg-slate-200 active:bg-slate-300",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950 active:bg-slate-200",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 active:bg-red-800",
  success:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800",
};

export default function Button({
  children,
  className,
  variant = "default",
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold",
        "transition duration-150 ease-out",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClassName[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
