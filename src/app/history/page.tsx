"use client";

import { useEffect, useState } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { TransactionList } from "@/components/TransactionList";
import { MonthSwitcher } from "@/components/MonthSwitcher";

export default function HistoryPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const monthKey = useBudgetStore((s) => s.selectedMonth);
  const items = useBudgetStore((s) => s.getMonthlyTransactions(monthKey));
  const categories = useBudgetStore((s) => s.categories);

  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const filtered = categoryFilter
    ? items.filter((t) => t.categoryId === categoryFilter)
    : items;

  if (!hydrated) {
    return (
      <div className="p-4 text-center text-sm text-stone-400">読み込み中…</div>
    );
  }

  return (
    <div className="flex-1 p-3 space-y-3">
      <header className="sticky top-0 bg-pink-50/95 pb-2 z-10">
        <h1 className="font-semibold text-stone-700 px-1 mb-1">履歴</h1>
        <MonthSwitcher />
      </header>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="w-full rounded-xl border border-pink-100 px-3 py-2 bg-white/90"
      >
        <option value="">すべてのカテゴリ</option>
        {[...categories]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
      </select>

      <TransactionList items={filtered} emptyText="この月の取引はありません" />
    </div>
  );
}
