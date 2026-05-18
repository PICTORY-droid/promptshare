"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteReportAction } from "../actions";

type DeleteReportButtonProps = {
  reportId: string;
};

export default function DeleteReportButton({
  reportId,
}: DeleteReportButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm("이 검사 기록을 삭제할까요?");

    if (!confirmed) {
      return;
    }

    setMessage(null);

    startTransition(async () => {
      const result = await deleteReportAction(reportId);

      if (!result.ok) {
        setMessage(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "삭제 중" : "삭제"}
      </button>

      {message ? (
        <p className="max-w-36 text-right text-[11px] leading-4 text-red-600">
          {message}
        </p>
      ) : null}
    </div>
  );
}