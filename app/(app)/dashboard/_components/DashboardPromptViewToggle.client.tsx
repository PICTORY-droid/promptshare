"use client";

import { useState } from "react";
import type { Prompt } from "@/features/prompts/types/prompt.types";
import DashboardPromptGrid from "./DashboardPromptGrid";
import DashboardPromptListRows from "./DashboardPromptListRows";

type PromptViewMode = "grid" | "list";

type DashboardPromptViewToggleProps = {
  prompts: Prompt[];
};

export default function DashboardPromptViewToggle({
  prompts,
}: DashboardPromptViewToggleProps) {
  const [viewMode, setViewMode] = useState<PromptViewMode>("grid");

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-500">
          총 {prompts.length.toLocaleString("ko-KR")}개
        </p>

        <div className="grid grid-cols-2 rounded-full border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            className={
              viewMode === "grid"
                ? "rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white"
                : "rounded-full px-3 py-1.5 text-xs font-bold text-slate-500"
            }
            onClick={() => setViewMode("grid")}
          >
            그리드
          </button>
          <button
            type="button"
            className={
              viewMode === "list"
                ? "rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white"
                : "rounded-full px-3 py-1.5 text-xs font-bold text-slate-500"
            }
            onClick={() => setViewMode("list")}
          >
            리스트
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <DashboardPromptGrid prompts={prompts} />
      ) : (
        <DashboardPromptListRows prompts={prompts} />
      )}
    </section>
  );
}