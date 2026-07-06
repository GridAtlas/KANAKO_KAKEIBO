"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { DashboardCards } from "@/components/DashboardCards";
import { ExpensePieChart } from "@/components/ExpensePieChart";
import { TransactionList } from "@/components/TransactionList";
import { MonthSwitcher } from "@/components/MonthSwitcher";

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const monthKey = useBudgetStore((s) => s.selectedMonth);
  const applyFixedCostsForMonth = useBudgetStore(
    (s) => s.applyFixedCostsForMonth,
  );
  const totals = useBudgetStore((s) => s.getMonthlyTotals(monthKey));
  const byCategory = useBudgetStore((s) => s.getMonthlyByCategory(monthKey));
  const recent = useBudgetStore((s) =>
    s.getMonthlyTransactions(monthKey).slice(0, 5),
  );
  const fixedCosts = useBudgetStore((s) => s.fixedCosts);
  const appliedMap = useBudgetStore((s) => s.appliedFixedCostMonths);

  // 固定費の未適用件数
  const pendingFixedCosts = fixedCosts.filter(
    (f) => f.active && !(appliedMap[f.id] ?? []).includes(monthKey),
  ).length;

  const fixedExpense = byCategory
    .filter((r) => r.category.isFixedCost && r.category.type === "expense")
    .reduce((a, x) => a + x.total, 0);
  const variableExpense = totals.expense - fixedExpense;

  if (!hydrated) {
    return (
      <div className="p-4 text-center text-sm text-slate-400">読み込み中…</div>
    );
  }

  return (
    <div className="flex-1 p-3 space-y-4">
      <MonthSwitcher />
      <DashboardCards
        totals={totals}
        fixedExpense={fixedExpense}
        variableExpense={variableExpense}
      />

      {pendingFixedCosts > 0 && (
        <button
          type="button"
          onClick={() => applyFixedCostsForMonth(monthKey)}
          className="tap-target w-full rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 py-3 font-semibold active:bg-amber-100"
        >
          今月の固定費 {pendingFixedCosts} 件を計上する
        </button>
      )}

      <ExpensePieChart data={byCategory} />

      <div>
        <div className="flex items-baseline justify-between px-1 mb-2">
          <h2 className="font-semibold text-sm text-slate-600">直近の履歴</h2>
          <Link
            href="/history"
            className="text-xs text-emerald-600 font-semibold"
          >
            すべて見る →
          </Link>
        </div>
        <TransactionList items={recent} />
      </div>
    </div>
  );
}
