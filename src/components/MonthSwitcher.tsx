"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { currentMonthKey, formatMonthLabel, shiftMonthKey } from "@/lib/date";

export function MonthSwitcher() {
  const monthKey = useBudgetStore((s) => s.selectedMonth);
  const setSelectedMonth = useBudgetStore((s) => s.setSelectedMonth);
  const isCurrent = monthKey === currentMonthKey();

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <button
        type="button"
        className="tap-target rounded-full p-1 text-slate-500 active:bg-slate-100"
        onClick={() => setSelectedMonth(shiftMonthKey(monthKey, -1))}
        aria-label="前月"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        className="font-semibold text-slate-700 px-3 py-1 rounded-lg active:bg-slate-100"
        onClick={() => setSelectedMonth(currentMonthKey())}
      >
        {formatMonthLabel(monthKey)}
        {!isCurrent && (
          <span className="ml-1 text-[10px] text-emerald-600">今月へ戻る</span>
        )}
      </button>
      <button
        type="button"
        className="tap-target rounded-full p-1 text-slate-500 active:bg-slate-100"
        onClick={() => setSelectedMonth(shiftMonthKey(monthKey, 1))}
        aria-label="翌月"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
