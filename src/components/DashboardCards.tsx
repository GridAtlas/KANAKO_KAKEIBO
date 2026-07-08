"use client";

import { formatYen } from "@/lib/money";
import type { MonthlyTotals } from "@/types";

interface Props {
  totals: MonthlyTotals;
  fixedExpense: number;
  variableExpense: number;
}

export function DashboardCards({ totals, fixedExpense, variableExpense }: Props) {
  return (
    <div className="space-y-3">
      {/* 大きな月合計 */}
      <div className="rounded-2xl bg-white/90 p-4 border border-pink-100 shadow-sm shadow-pink-100/60">
        <div className="text-xs text-stone-500 mb-1">今月の支出</div>
        <div className="num text-3xl font-bold text-rose-600">
          {formatYen(totals.expense)}
        </div>
        <div className="mt-2 flex gap-4 text-xs">
          <div>
            <span className="text-stone-500">固定 </span>
            <span className="num font-semibold">
              {formatYen(fixedExpense)}
            </span>
          </div>
          <div>
            <span className="text-stone-500">変動 </span>
            <span className="num font-semibold">
              {formatYen(variableExpense)}
            </span>
          </div>
        </div>
      </div>

      {/* 収入 / 収支 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/90 p-3 border border-pink-100 shadow-sm shadow-pink-100/60">
          <div className="text-xs text-stone-500 mb-1">今月の収入</div>
          <div className="num text-xl font-bold text-emerald-600">
            {formatYen(totals.income)}
          </div>
        </div>
        <div className="rounded-2xl bg-white/90 p-3 border border-pink-100 shadow-sm shadow-pink-100/60">
          <div className="text-xs text-stone-500 mb-1">収支</div>
          <div
            className={`num text-xl font-bold ${
              totals.balance >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {formatYen(totals.balance)}
          </div>
        </div>
      </div>
    </div>
  );
}
