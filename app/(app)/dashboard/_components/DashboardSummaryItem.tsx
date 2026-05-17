type DashboardSummaryItemProps = {
  label: string;
  title: string;
  value: string;
  valueClassName?: string;
};

export default function DashboardSummaryItem({
  label,
  title,
  value,
  valueClassName = "text-sm",
}: DashboardSummaryItemProps) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text-xs font-bold text-slate-950">
          {label}
        </span>
        <span className="truncate text-xs text-slate-500">
          {title}
        </span>
      </div>

      <span
        className={`min-w-0 max-w-[52%] truncate text-right font-bold text-slate-950 ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}