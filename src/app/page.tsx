"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { DashboardCards } from "@/components/DashboardCards";
import { ExpensePieChart } from "@/components/ExpensePieChart";
import { TransactionList } from "@/components/TransactionList";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { TitleHero } from "@/components/TitleHero";
import { MonthlyInsights } from "@/components/MonthlyInsights";

type HomeView = "main" | "title";

export default function HomePage() {
  const [hydrated, setHydrated] = useState(false);
  const [activeView, setActiveView] = useState<HomeView>("main");
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
      <div className="p-4 text-center text-sm text-stone-400">読み込み中…</div>
    );
  }

  return (
    <div className="flex-1 pb-4">
      <div className="sticky top-0 z-20 bg-pink-50/90 px-3 pt-3 pb-2 backdrop-blur">
        <div className="grid grid-cols-2 rounded-full border border-pink-100 bg-white/90 p-1 shadow-sm shadow-pink-100/60">
          <ViewTab
            active={activeView === "title"}
            onClick={() => setActiveView("title")}
          >
            タイトル
          </ViewTab>
          <ViewTab
            active={activeView === "main"}
            onClick={() => setActiveView("main")}
          >
            家計簿
          </ViewTab>
        </div>
      </div>

      {activeView === "title" ? (
        <div className="px-3 pb-28 space-y-3">
          <TitleHero />
          <button
            type="button"
            onClick={() => setActiveView("main")}
            className="tap-target w-full rounded-2xl bg-pink-500 py-3 font-bold text-white shadow-lg shadow-pink-200/80 active:bg-pink-600"
          >
            家計簿を見る
          </button>
        </div>
      ) : (
        <div className="p-3 pt-1 space-y-4">
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

          <MonthlyInsights />
          <ExpensePieChart data={byCategory} />

          <div>
            <div className="flex items-baseline justify-between px-1 mb-2">
              <h2 className="font-semibold text-sm text-stone-700">直近の履歴</h2>
              <Link
                href="/history"
                className="text-xs text-pink-600 font-semibold"
              >
                すべて見る →
              </Link>
            </div>
            <TransactionList items={recent} />
          </div>
        </div>
      )}
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap-target rounded-full px-3 py-2 text-sm font-bold transition ${
        active
          ? "bg-pink-500 text-white shadow-sm shadow-pink-200/70"
          : "text-stone-500 active:bg-pink-50"
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}