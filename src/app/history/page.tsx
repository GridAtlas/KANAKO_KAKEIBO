"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, ReceiptText } from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { TransactionList } from "@/components/TransactionList";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { daysInMonth, formatDateShort, monthKeyOf } from "@/lib/date";
import type { Transaction } from "@/types";

const MOBILE_PAGE_SIZE = 4;

function readMonth(value: string | null): string | null {
  return value && /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/.test(value) ? value : null;
}

function readDate(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-(0[1-9]|[12]\d|3[01])$/.test(value)) return null;

  const month = readMonth(monthKeyOf(value));
  return month && Number(value.slice(-2)) <= daysInMonth(month) ? value : null;
}

function HistoryLoading() {
  return <div className="p-4 text-center text-sm text-[var(--muted)]">読み込み中…</div>;
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
  const [compact, setCompact] = useState<boolean>();
  useEffect(() => {
    const viewport = window.matchMedia("(max-width: 639px)");
    const update = () => setCompact(viewport.matches);
    update();
    viewport.addEventListener("change", update);
    return () => viewport.removeEventListener("change", update);
  }, []);

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

  if (compact === undefined) return <HistoryLoading />;

  return (
    <main className="compact-page flex-1 space-y-1.5 px-3 py-2 sm:space-y-3 sm:px-4 sm:py-4">
      <header className="border-b border-[var(--line)]">
        <h1 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[var(--ink)]">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-[#efd2da] bg-[#f9e6ec] text-[var(--accent)]">
            <ReceiptText size={17} strokeWidth={1.75} aria-hidden="true" />
          </span>
          履歴
        </h1>
        <div className="[&_button]:text-[var(--accent)] [&_button:hover]:bg-[#fbedf0] [&_span]:text-[var(--muted)]">
          <MonthSwitcher monthKey={monthKey} onMonthChange={changeMonth} />
        </div>
      </header>

      {date && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-[#efd2da] bg-[#fbecf1] px-3 text-sm">
          <span className="font-semibold text-[var(--ink)]">{formatDateShort(date)}の履歴</span>
          <button
            type="button"
            className="tap-target shrink-0 text-sm font-semibold text-[var(--accent)] underline underline-offset-4"
            onClick={() => changeMonth(monthKey)}
          >
            月全体を表示
          </button>
        </div>
      )}

      <div className="relative">
        <select
          aria-label="カテゴリで絞り込み"
          value={categoryFilter}
          onChange={(e) => changeCategory(e.target.value)}
          className="min-h-11 w-full appearance-none rounded-xl border border-[var(--line)] bg-[var(--surface)] py-2 pl-3 pr-10 text-[var(--ink)]"
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
        <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent)]" aria-hidden="true" />
      </div>

      <HistoryTransactions
        key={JSON.stringify([monthKey, date, categoryFilter])}
        items={filtered}
        emptyText={date ? "この日の取引はありません" : "この月の取引はありません"}
        compact={compact}
      />
    </main>
  );
}

function HistoryTransactions({ items, emptyText, compact }: {
  items: Transaction[];
  emptyText: string;
  compact: boolean;
}) {
  const [requestedPage, setRequestedPage] = useState(0);
  const pageCount = Math.ceil(items.length / MOBILE_PAGE_SIZE);
  const page = Math.min(requestedPage, Math.max(0, pageCount - 1));
  const pageStart = page * MOBILE_PAGE_SIZE;

  return (
    <div className="space-y-1.5">
      <TransactionList
        items={compact ? items.slice(pageStart, pageStart + MOBILE_PAGE_SIZE) : items}
        emptyText={emptyText}
        compact={compact}
      />
      {compact && pageCount > 1 && (
        <div className="flex items-center justify-center gap-2" role="group" aria-label="履歴のページ切り替え">
          <button
            type="button"
            className="tap-target grid place-items-center rounded-full text-[var(--accent)] enabled:bg-[#fbedf0] enabled:hover:bg-[var(--blush)] disabled:text-[#b9a2a8]"
            aria-label="前の履歴ページ"
            disabled={page === 0}
            onClick={() => setRequestedPage(page - 1)}
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <span className="min-w-12 text-center text-xs font-bold tabular-nums text-[var(--muted)]" aria-live="polite">
            {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            className="tap-target grid place-items-center rounded-full text-[var(--accent)] enabled:bg-[#fbedf0] enabled:hover:bg-[var(--blush)] disabled:text-[#b9a2a8]"
            aria-label="次の履歴ページ"
            disabled={page === pageCount - 1}
            onClick={() => setRequestedPage(page + 1)}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
