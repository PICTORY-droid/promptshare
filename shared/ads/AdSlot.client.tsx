"use client";

type AdSlotProps = {
  label?: string;
};

export default function AdSlot({ label = "광고 영역" }: AdSlotProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        실제 광고 코드는 아직 연결하지 않았습니다.
      </p>
    </div>
  );
}