"use client";

import { AD_GATE_COPY } from "@/features/ads/constants/ad-policy";
import Button from "@/shared/ui/button";
import AdSlot from "@/shared/ads/AdSlot.client";

type AdGateModalProps = {
  open: boolean;
  usageCount: number;
  onViewAd: () => void;
  onClose: () => void;
};

export default function AdGateModal({
  open,
  usageCount,
  onViewAd,
  onClose,
}: AdGateModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl sm:p-6">
        <div className="space-y-2">
          <p className="text-lg font-semibold text-slate-950">
            {AD_GATE_COPY.title}
          </p>
          <p className="text-sm leading-6 text-slate-600">
            {AD_GATE_COPY.description}
          </p>
          <p className="text-xs leading-5 text-slate-500">
            현재 SafeCheck 사용 횟수: {usageCount.toLocaleString("ko-KR")}회
          </p>
        </div>

        <div className="mt-4">
          <AdSlot label="광고 placeholder" />
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          {AD_GATE_COPY.notice}
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button type="button" onClick={onViewAd}>
            {AD_GATE_COPY.primaryAction}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            {AD_GATE_COPY.secondaryAction}
          </Button>
        </div>
      </div>
    </div>
  );
}