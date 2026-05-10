import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type DialogProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Dialog({ children, className, ...props }: DialogProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogTitle({ children, className, ...props }: DialogProps) {
  return (
    <h2 className={cn("text-lg font-bold text-slate-950", className)} {...props}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className,
  ...props
}: DialogProps) {
  return (
    <p className={cn("mt-2 text-sm leading-6 text-slate-600", className)} {...props}>
      {children}
    </p>
  );
}

export function DialogFooter({ children, className, ...props }: DialogProps) {
  return (
    <div className={cn("mt-6 flex justify-end gap-2", className)} {...props}>
      {children}
    </div>
  );
}
