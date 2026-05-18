import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("mb-3 space-y-1 sm:mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: CardProps) {
  return (
    <h2
      className={cn(
        "text-base font-semibold tracking-tight text-slate-950 sm:text-lg",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function CardDescription({ children, className, ...props }: CardProps) {
  return (
    <p className={cn("text-sm leading-6 text-slate-600", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("space-y-3 sm:space-y-4", className)} {...props}>
      {children}
    </div>
  );
}