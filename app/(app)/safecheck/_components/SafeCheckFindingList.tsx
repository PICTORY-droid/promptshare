import type { SafeCheckResult } from "@/features/safecheck/types/safecheck.types";
import SafeCheckFindingItem from "./SafeCheckFindingItem";

type SafeCheckFindingListProps = {
  findings: SafeCheckResult["findings"];
};

export default function SafeCheckFindingList({
  findings,
}: SafeCheckFindingListProps) {
  if (findings.length === 0) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-900">
          감지된 위험 요소가 없습니다.
        </p>
        <p className="mt-1 text-sm leading-6 text-emerald-800">
          공개 전 최종 문맥은 한 번 더 확인하세요.
        </p>
      </div>
    );
  }

  return (
    <details className="rounded-2xl border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold text-slate-800">
        위험 상세 보기
      </summary>

      <div className="mt-4 space-y-3">
        {findings.map((finding) => (
          <SafeCheckFindingItem
            key={finding.category}
            finding={finding}
          />
        ))}
      </div>
    </details>
  );
}