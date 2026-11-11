"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { DashboardCards } from "@/components/DashboardCards";
import { ExpensePieChart } from "@/components/ExpensePieChart";
import { MonthlyInsights } from "@/components/MonthlyInsights";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { useBudgetStore } from "@/store/useBudgetStore";

const dashboardViews = [
  { id: "summary", label: "収支" },
  { id: "expenses", label: "支出の内訳" },
] as const;

export function DashboardView() {
  const [view, setView] = useState<(typeof dashboardViews)[number]["id"]>("summary");
  const monthKey = useBudgetStore((state) => state.selectedMonth);
  const applyFixedCostsForMonth = useBudgetStore((state) => state.applyFixedCostsForMonth);
  const totals = useBudgetStore((state) => state.getMonthlyTotals(monthKey));
  const byCategory = useBudgetStore((state) => state.getMonthlyByCategory(monthKey));
  const fixedCosts = useBudgetStore((state) => state.fixedCosts);
  const appliedMap = useBudgetStore((state) => state.appliedFixedCostMonths);

  const pendingFixedCosts = fixedCosts.filter(
    (cost) => cost.active && !(appliedMap[cost.id] ?? []).includes(monthKey),
  ).length;
  const fixedExpense = byCategory
    .filter(({ category }) => category.type === "expense" && category.isFixedCost)
    .reduce((sum, { total }) => sum + total, 0);

  return (
    <AnalyticsPage title="月の家計簿" linkHref="/trends" linkLabel="月ごとの推移">
      <div role="group" aria-label="表示するデータ" className="grid grid-cols-2 gap-1 rounded-xl bg-[#f7e6ea] p-0.5">
        {dashboardViews.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={view === id}
            onClick={() => setView(id)}
            className="tap-target rounded-[10px] px-2 text-sm font-bold text-[var(--muted)] aria-pressed:bg-[var(--surface)] aria-pressed:text-[var(--accent)] aria-pressed:shadow-[inset_0_0_0_1px_#eacbd3]"
          >
            {label}
          </button>
        ))}
      </div>
      {view === "summary" ? (
        <div className="mt-2 space-y-1.5">
          <DashboardCards totals={totals} fixedExpense={fixedExpense} variableExpense={totals.expense - fixedExpense} />
          {pendingFixedCosts > 0 && (
            <button
              type="button"
              onClick={() => applyFixedCostsForMonth(monthKey)}
              className="tap-target w-full rounded-xl border border-[#ead8bd] bg-[#fbf3e6] px-2 text-sm font-bold text-[#795627] hover:bg-[#f7ebd7]"
            >
              固定費 {pendingFixedCosts} 件を計上
            </button>
          )}
          <Link
            href={{ pathname: "/history", query: { month: monthKey } }}
            className="tap-target flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-2 text-sm font-bold text-[var(--accent)] hover:bg-[#faedf0]"
          >
            この月の履歴
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-2">
          <ExpensePieChart key={monthKey} data={byCategory} monthKey={monthKey} />
        </div>
      )}
    </AnalyticsPage>
  );
}

export function TrendsView() {
  return (
    <AnalyticsPage title="月ごとの推移" linkHref="/dashboard" linkLabel="月の家計簿">
      <MonthlyInsights />
    </AnalyticsPage>
  );
}

function AnalyticsPage({
  title,
  linkHref,
  linkLabel,
  children,
}: {
  title: string;
  linkHref: string;
  linkLabel: string;
  children: ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <main className="wide-page compact-page w-full px-3 pb-2 pt-2 sm:px-6 md:pt-4">
      <BudgetPageHeader />
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">{title}</h1>
          <Link href={linkHref} className="tap-target inline-flex items-center gap-1.5 rounded-lg px-1.5 text-xs font-bold text-[var(--accent)] hover:bg-[#faedf0] sm:text-sm">
            {linkLabel}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        {hydrated ? (
          <>
            <MonthSwitcher />
            {children}
          </>
        ) : (
          <p role="status" className="text-sm text-[var(--muted)]">読み込み中…</p>
        )}
      </div>
    </main>
  );
}
