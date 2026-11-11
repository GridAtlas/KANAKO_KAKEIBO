"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useBudgetStore } from "@/store/useBudgetStore";
import { formatYen } from "@/lib/money";
import { shiftMonthKey } from "@/lib/date";

const incomeColor = "#70946b";
const expenseColor = "#ce8575";

export function MonthlyInsights() {
  const selectedMonth = useBudgetStore((state) => state.selectedMonth);
  const months = useMemo(
    () => Array.from({ length: 6 }, (_, index) => shiftMonthKey(selectedMonth, index - 5)),
    [selectedMonth],
  );
  const rows = useBudgetStore((state) =>
    months.map((monthKey) => ({
      ...state.getMonthlyTotals(monthKey),
      monthKey,
      label: `${Number(monthKey.slice(5, 7))}月`,
    })),
  );

  const current = rows[5];
  const previous = rows[4];
  const savingsRate = current.income > 0 ? Math.round((current.balance / current.income) * 100) : null;
  const expenseDelta = current.expense - previous.expense;
  const averageBalance = rows.reduce((sum, row) => sum + row.balance, 0) / rows.length;
  const expenseSign = expenseDelta > 0 ? "+" : expenseDelta < 0 ? "−" : "";

  return (
    <section aria-label="月ごとの分析" className="rounded-2xl border border-[#eadccf] bg-[#fffdf8] p-3 text-[#3b2721] sm:p-5">
      <dl className="grid grid-cols-3 divide-x divide-[#eadccf] border-b border-[#eadccf] pb-3 text-center">
        <InsightStat label="貯金率" value={savingsRate === null ? "—" : `${savingsRate}%`} negative={savingsRate !== null && savingsRate < 0} />
        <InsightStat label="支出の前月比" value={`${expenseSign}${formatYen(Math.abs(expenseDelta))}`} negative={expenseDelta > 0} />
        <InsightStat label="平均収支" value={formatYen(averageBalance)} negative={averageBalance < 0} />
      </dl>
      <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <h2 className="text-sm font-bold">6か月の収入と支出</h2>
        <span className="text-xs font-semibold text-[#765b50]">収支 {formatYen(current.balance)}</span>
      </div>
      <div className="mt-1 flex gap-3 text-xs text-[#765b50]">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: incomeColor }} aria-hidden="true" />収入
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: expenseColor }} aria-hidden="true" />支出
        </span>
      </div>
      <div className="h-40 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} accessibilityLayer margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#eadccf" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#765b50" }} />
            <YAxis hide />
            <Tooltip
              trigger="click"
              isAnimationActive={false}
              formatter={(value, name) => [formatYen(Number(value)), name === "income" ? "収入" : "支出"]}
              contentStyle={{ fontSize: 12, borderRadius: 10, borderColor: "#eadccf", background: "#fffdf8" }}
            />
            <Bar dataKey="income" fill={incomeColor} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="expense" fill={expenseColor} radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <table>
          <caption>6か月の収入と支出</caption>
          <thead>
            <tr><th scope="col">月</th><th scope="col">収入</th><th scope="col">支出</th></tr>
          </thead>
          <tbody>
            {rows.map(({ monthKey, label, income, expense }) => (
              <tr key={monthKey}>
                <th scope="row">{label}</th>
                <td>{formatYen(income)}</td>
                <td>{formatYen(expense)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InsightStat({ label, value, negative }: { label: string; value: string; negative: boolean }) {
  return (
    <div className="min-w-0 px-1">
      <dt className="text-xs text-[#765b50]">{label}</dt>
      <dd className={`mt-0.5 break-words text-sm font-bold leading-tight tabular-nums ${negative ? "text-[#a13e34]" : ""}`}>{value}</dd>
    </div>
  );
}
