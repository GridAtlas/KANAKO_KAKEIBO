"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { colorHex } from "@/lib/colors";
import { formatYen } from "@/lib/money";
import type { CategoryTotal } from "@/types";

const categoriesPerPage = 4;

export function ExpensePieChart({ data, monthKey }: { data: CategoryTotal[]; monthKey: string }) {
  const [pageIndex, setPageIndex] = useState(0);
  const chartData = data
    .filter(({ category }) => category.type === "expense")
    .map(({ category, total }) => ({
      id: category.id,
      name: category.name,
      value: total,
      color: colorHex(category.color),
    }));

  if (chartData.length === 0) {
    return (
      <p className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 text-center text-sm text-[var(--muted)]">
        この月の支出はありません。
      </p>
    );
  }

  const pageCount = Math.ceil(chartData.length / categoriesPerPage);
  const page = Math.min(pageIndex, pageCount - 1);
  const first = page * categoriesPerPage;
  const canRenderChart = typeof ResizeObserver === "function";

  return (
    <section aria-label="カテゴリごとの支出" className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2.5 shadow-[0_5px_16px_rgba(64,38,45,0.05)] sm:p-4">
      <div className={`grid items-center gap-2 sm:gap-4 ${canRenderChart ? "grid-cols-[6rem_minmax(0,1fr)] sm:grid-cols-[9rem_minmax(0,1fr)]" : ""} ${pageCount > 1 ? "min-h-[179px]" : ""}`}>
        {canRenderChart && (
          <div className="aspect-square min-w-0 rounded-full bg-[#fcf0f2]" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="57%" outerRadius="94%" paddingAngle={1.5} stroke="#fffcf8" isAnimationActive={false}>
                  {chartData.map(({ id, color }) => (
                    <Cell key={id} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        <ul className="min-w-0 divide-y divide-[var(--line)]">
          {chartData.slice(first, first + categoriesPerPage).map(({ id, name, value, color }) => (
            <li key={id}>
              <Link
                href={{ pathname: "/history", query: { month: monthKey, category: id } }}
                className="tap-target flex min-w-0 items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[var(--ink)] hover:bg-[#faedf0]"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-xs font-semibold" title={name}>{name}</span>
                  <span className="block break-words text-xs font-bold tabular-nums">{formatYen(value)}</span>
                </span>
                <ChevronRight size={15} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {pageCount > 1 && (
        <div className="mt-1 flex items-center justify-center gap-1 border-t border-[var(--line)]">
          <button
            type="button"
            aria-label="前のカテゴリ"
            disabled={page === 0}
            onClick={() => setPageIndex(page - 1)}
            className="tap-target grid place-items-center rounded-lg text-[var(--accent)] hover:bg-[#faedf0] disabled:text-[#b9a0a7]"
          >
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
          <span className="min-w-12 text-center text-xs font-bold tabular-nums text-[var(--muted)]" aria-live="polite">{page + 1} / {pageCount}</span>
          <button
            type="button"
            aria-label="次のカテゴリ"
            disabled={page === pageCount - 1}
            onClick={() => setPageIndex(page + 1)}
            className="tap-target grid place-items-center rounded-lg text-[var(--accent)] hover:bg-[#faedf0] disabled:text-[#b9a0a7]"
          >
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
