import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type ButtonVariant = "default" | "secondary" | "ghost" | "danger" | "success";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClassName: Record<ButtonVariant, string> = {
  default:
    "border border-slate-950 bg-slate-950 text-white shadow-sm hover:bg-slate-800",
  secondary:
    "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50",
  ghost:
    "border border-transparent bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950",
  danger:
    "border border-red-600 bg-red-600 text-white shadow-sm hover:bg-red-700",
  success:
    "border border-emerald-600 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
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
        "inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
        "transition-colors duration-150 ease-out",
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