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
      <p className="rounded-2xl border border-[#eadccf] bg-[#fffdf8] p-5 text-center text-sm text-[#765b50]">
        この月の支出はありません。
      </p>
    );
  }

  const pageCount = Math.ceil(chartData.length / categoriesPerPage);
  const page = Math.min(pageIndex, pageCount - 1);
  const first = page * categoriesPerPage;

  return (
    <section aria-label="カテゴリごとの支出" className="rounded-2xl border border-[#eadccf] bg-[#fffdf8] p-2.5 sm:p-4">
      <div className={`grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4 ${pageCount > 1 ? "min-h-[179px]" : ""}`}>
        <div className="aspect-square min-w-0" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="53%" outerRadius="94%" paddingAngle={1.5} isAnimationActive={false}>
                {chartData.map(({ id, color }) => (
                  <Cell key={id} fill={color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="min-w-0 divide-y divide-[#f0e5db]">
          {chartData.slice(first, first + categoriesPerPage).map(({ id, name, value, color }) => (
            <li key={id}>
              <Link
                href={{ pathname: "/history", query: { month: monthKey, category: id } }}
                className="tap-target flex min-w-0 items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[#3b2721] hover:bg-[#faede6]"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-xs font-semibold" title={name}>{name}</span>
                  <span className="block break-words text-xs font-bold tabular-nums">{formatYen(value)}</span>
                </span>
                <ChevronRight size={15} className="shrink-0 text-[#983e34]" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {pageCount > 1 && (
        <div className="mt-1 flex items-center justify-center gap-1 border-t border-[#f0e5db]">
          <button
            type="button"
            aria-label="前のカテゴリ"
            disabled={page === 0}
            onClick={() => setPageIndex(page - 1)}
            className="tap-target grid place-items-center rounded-lg text-[#983e34] hover:bg-[#faede6] disabled:text-[#bca799]"
          >
            <ChevronLeft size={19} aria-hidden="true" />
          </button>
          <span className="min-w-12 text-center text-xs font-bold tabular-nums text-[#765b50]" aria-live="polite">{page + 1} / {pageCount}</span>
          <button
            type="button"
            aria-label="次のカテゴリ"
            disabled={page === pageCount - 1}
            onClick={() => setPageIndex(page + 1)}
            className="tap-target grid place-items-center rounded-lg text-[#983e34] hover:bg-[#faede6] disabled:text-[#bca799]"
          >
            <ChevronRight size={19} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
