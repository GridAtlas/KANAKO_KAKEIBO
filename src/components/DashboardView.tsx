"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DashboardCards } from "@/components/DashboardCards";
import { ExpensePieChart } from "@/components/ExpensePieChart";
import { MonthlyInsights } from "@/components/MonthlyInsights";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { TransactionList } from "@/components/TransactionList";
import { useBudgetStore } from "@/store/useBudgetStore";

export function DashboardView() {
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

  const pendingFixedCosts = fixedCosts.filter(
    (f) => f.active && !(appliedMap[f.id] ?? []).includes(monthKey),
  ).length;

  const fixedExpense = byCategory
    .filter((r) => r.category.isFixedCost && r.category.type === "expense")
    .reduce((a, x) => a + x.total, 0);
  const variableExpense = totals.expense - fixedExpense;

  if (!hydrated) {
    return (
      <div className="p-4 text-center text-sm text-stone-400">読み込み中…</div>
    );
  }

  return (
    <div className="flex-1 p-3 pb-28 space-y-4">
      <header className="flex items-center justify-between px-1 pt-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-400">
            Dashboard
          </p>
          <h1 className="text-lg font-bold text-stone-800">家計簿</h1>
        </div>
        <Link href="/" className="text-xs font-semibold text-pink-600">
          ホームへ
        </Link>
      </header>

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
          className="tap-target w-full rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-700 py-3 font-semibold shadow-sm active:bg-amber-100"
        >
          今月の固定費 {pendingFixedCosts} 件を計上する
        </button>
      )}

      <ExpensePieChart data={byCategory} />

      <div>
        <div className="flex items-baseline justify-between px-1 mb-2">
          <h2 className="font-semibold text-sm text-stone-700">直近の履歴</h2>
          <Link href="/history" className="text-xs text-pink-600 font-semibold">
            すべて見る →
          </Link>
        </div>
        <TransactionList items={recent} />
      </div>

      <Link
        href="/trends"
        className="tap-target flex items-center justify-center rounded-2xl border border-pink-100 bg-white/90 py-3 text-sm font-bold text-pink-600 shadow-sm shadow-pink-100/60 active:bg-pink-50"
      >
        月ごとの推移を見る
      </Link>
    </div>
  );
}

export function TrendsView() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="p-4 text-center text-sm text-stone-400">読み込み中…</div>
    );
  }

  return (
    <div className="flex-1 p-3 pb-28 space-y-4">
      <header className="flex items-center justify-between px-1 pt-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-400">
            Trends
          </p>
          <h1 className="text-lg font-bold text-stone-800">月ごとの推移</h1>
        </div>
        <Link href="/" className="text-xs font-semibold text-pink-600">
          ホームへ
        </Link>
      </header>

      <MonthSwitcher />
      <MonthlyInsights />

      <Link
        href="/dashboard"
        className="tap-target flex items-center justify-center rounded-2xl bg-pink-500 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200/80 active:bg-pink-600"
      >
        家計簿を見る
      </Link>
    </div>
  );
}
