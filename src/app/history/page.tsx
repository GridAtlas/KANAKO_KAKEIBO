"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBudgetStore } from "@/store/useBudgetStore";
import { TransactionList } from "@/components/TransactionList";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { daysInMonth, formatDateShort, monthKeyOf } from "@/lib/date";

function readMonth(value: string | null): string | null {
  return value && /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : null;
}

function readDate(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-(0[1-9]|[12]\d|3[01])$/.test(value)) return null;

  const month = readMonth(monthKeyOf(value));
  return month && Number(value.slice(-2)) <= daysInMonth(month) ? value : null;
}

function HistoryLoading() {
  return <div className="p-4 text-center text-sm text-stone-400">読み込み中…</div>;
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<HistoryLoading />}>
      <HistoryContent />
    </Suspense>
  );
}

function HistoryContent() {
  const searchParams = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const selectedMonth = useBudgetStore((s) => s.selectedMonth);
  const setSelectedMonth = useBudgetStore((s) => s.setSelectedMonth);
  const date = readDate(searchParams.get("date"));
  const monthKey = date
    ? monthKeyOf(date)
    : readMonth(searchParams.get("month")) ?? selectedMonth;
  const items = useBudgetStore((s) => s.getMonthlyTransactions(monthKey));
  const categories = useBudgetStore((s) => s.categories);
  const requestedCategory = searchParams.get("category");
  const categoryFilter = categories.find((c) => c.id === requestedCategory)?.id ?? "";
  const filtered = items.filter(
    (t) => (!date || t.date === date) && (!categoryFilter || t.categoryId === categoryFilter),
  );

  function replaceQuery(params: URLSearchParams) {
    const url = new URL(window.location.href);
    url.search = params.toString();
    // 履歴の絞り込みは通信なしで反映する。
    window.history.replaceState(null, "", url);
  }

  function changeMonth(month: string) {
    setSelectedMonth(month);
    if (searchParams.has("date") || searchParams.has("month")) {
      const params = new URLSearchParams(searchParams);
      params.delete("date");
      params.delete("month");
      replaceQuery(params);
    }
  }

  function changeCategory(category: string) {
    const params = new URLSearchParams(searchParams);
    if (category) params.set("category", category);
    else params.delete("category");
    replaceQuery(params);
  }

  if (!hydrated) return <HistoryLoading />;

  return (
    <div className="flex-1 p-3 space-y-3">
      <header className="sticky top-0 bg-pink-50/95 pb-2 z-10">
        <h1 className="font-semibold text-stone-700 px-1 mb-1">履歴</h1>
        <MonthSwitcher monthKey={monthKey} onMonthChange={changeMonth} />
      </header>

      {date && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-pink-100 bg-pink-100/60 px-3 text-sm">
          <span className="font-semibold text-stone-700">{formatDateShort(date)}の履歴</span>
          <button
            type="button"
            className="min-h-11 shrink-0 font-semibold text-pink-700 underline underline-offset-4"
            onClick={() => changeMonth(monthKey)}
          >
            月全体を表示
          </button>
        </div>
      )}

      <select
        aria-label="カテゴリで絞り込み"
        value={categoryFilter}
        onChange={(e) => changeCategory(e.target.value)}
        className="min-h-11 w-full rounded-xl border border-pink-100 px-3 py-2 bg-white/90"
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

      <TransactionList
        items={filtered}
        emptyText={date ? "この日の取引はありません" : "この月の取引はありません"}
      />
    </div>
  );
}
