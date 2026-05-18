import type { ReactNode } from "react";
import Badge from "@/shared/ui/badge";
import { cn } from "@/shared/lib/cn";

type PageHeaderProps = {
  badge?: string;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  className?: string;
};

export default function PageHeader({
  badge,
  title,
  description,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-2.5 sm:space-y-3", className)}>
      {badge ? <Badge>{badge}</Badge> : null}

      <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {title}
      </h1>

      {description ? (
        <div className="max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </div>
      ) : null}

      {meta ? (
        <div className="break-all text-xs leading-5 text-slate-500">
          {meta}
        </div>
      ) : null}
    </header>
  );
}