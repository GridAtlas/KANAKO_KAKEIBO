"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { currentMonthKey, formatMonthLabel, shiftMonthKey } from "@/lib/date";

interface Props {
  monthKey?: string;
  onMonthChange?: (monthKey: string) => void;
}

export function MonthSwitcher({ monthKey: displayedMonth, onMonthChange }: Props) {
  const selectedMonth = useBudgetStore((s) => s.selectedMonth);
  const setSelectedMonth = useBudgetStore((s) => s.setSelectedMonth);
  const monthKey = displayedMonth ?? selectedMonth;
  const changeMonth = onMonthChange ?? setSelectedMonth;
  const isCurrent = monthKey === currentMonthKey();

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <button
        type="button"
        className="tap-target rounded-full p-1 text-stone-500 active:bg-pink-100"
        onClick={() => changeMonth(shiftMonthKey(monthKey, -1))}
        aria-label="前月"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        className="min-h-11 font-semibold text-stone-700 px-3 py-1 rounded-lg active:bg-pink-100"
        onClick={() => changeMonth(currentMonthKey())}
      >
        {formatMonthLabel(monthKey)}
        {!isCurrent && (
          <span className="ml-1 text-[10px] text-pink-600">今月へ戻る</span>
        )}
      </button>
      <button
        type="button"
        className="tap-target rounded-full p-1 text-stone-500 active:bg-pink-100"
        onClick={() => changeMonth(shiftMonthKey(monthKey, 1))}
        aria-label="翌月"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
