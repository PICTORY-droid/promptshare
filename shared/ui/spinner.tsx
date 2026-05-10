import { cn } from "@/shared/lib/cn";

type SpinnerProps = {
  className?: string;
  label?: string;
};

export default function Spinner({ className, label = "로딩 중" }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-500">
      <span
        aria-hidden="true"
        className={cn(
          "h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900",
          className,
        )}
      />
      <span>{label}</span>
    </span>
  );
}
