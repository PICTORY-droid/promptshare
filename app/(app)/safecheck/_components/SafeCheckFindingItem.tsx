import type { SafeCheckResult } from "@/features/safecheck/types/safecheck.types";
import Badge from "@/shared/ui/badge";

type SafeCheckFindingItemProps = {
  finding: SafeCheckResult["findings"][number];
};

export default function SafeCheckFindingItem({
  finding,
}: SafeCheckFindingItemProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{finding.label}</Badge>
        <span className="text-xs text-slate-400">
          +{finding.score}점
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {finding.reason}
      </p>

      <p className="mt-2 break-words text-xs leading-5 text-slate-500">
        감지값: {finding.matches.join(", ")}
      </p>
    </div>
  );
}