"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  WalletCards,
} from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { formatYen } from "@/lib/money";
import { shiftMonthKey } from "@/lib/date";

type TrendRow = {
  monthKey: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
};

function formatPercent(value: number | null): string {
  if (value === null) return "--";
  return `${Math.round(value)}%`;
}

function monthLabel(monthKey: string): string {
  return `${Number(monthKey.slice(5, 7))}月`;
}

export function MonthlyInsights() {
  const selectedMonth = useBudgetStore((s) => s.selectedMonth);
  const months = useMemo(
    () => Array.from({ length: 6 }, (_, i) => shiftMonthKey(selectedMonth, i - 5)),
    [selectedMonth],
  );
  const rows = useBudgetStore((s) =>
    months.map<TrendRow>((monthKey) => {
      const totals = s.getMonthlyTotals(monthKey);
      return {
        monthKey,
        label: monthLabel(monthKey),
        income: totals.income,
        expense: totals.expense,
        balance: totals.balance,
      };
    }),
  );

  const current = rows[rows.length - 1];
  const previous = rows[rows.length - 2];
  const savingsRate =
    current.income > 0 ? (current.balance / current.income) * 100 : null;
  const expenseDelta = previous ? current.expense - previous.expense : 0;
  const balanceDelta = previous ? current.balance - previous.balance : 0;
  const averageBalance = Math.round(
    rows.reduce((sum, row) => sum + row.balance, 0) / rows.length,
  );
  const expenseDeltaIsGood = expenseDelta <= 0;

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="font-semibold text-sm text-stone-700">月ごとのデータ</h2>
        <span className="text-[11px] text-stone-500">直近 6 か月</span>
      </div>

      <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2">
        <InsightStat
          title="貯金率"
          value={formatPercent(savingsRate)}
          helper={savingsRate === null ? "収入待ち" : "収支 ÷ 収入"}
          icon={<PiggyBank size={16} />}
          tone={savingsRate !== null && savingsRate >= 20 ? "good" : "normal"}
        />
        <InsightStat
          title="支出 前月比"
          value={formatYen(Math.abs(expenseDelta))}
          helper={expenseDelta === 0 ? "変化なし" : expenseDeltaIsGood ? "減少" : "増加"}
          icon={
            expenseDeltaIsGood ? (
              <ArrowDownRight size={16} />
            ) : (
              <ArrowUpRight size={16} />
            )
          }
          tone={expenseDeltaIsGood ? "good" : "caution"}
        />
        <InsightStat
          title="平均収支"
          value={formatYen(averageBalance)}
          helper={balanceDelta >= 0 ? "改善傾向" : "見直し中"}
          icon={<WalletCards size={16} />}
          tone={averageBalance >= 0 ? "good" : "caution"}
        />
      </div>

      <div className="rounded-2xl bg-white/90 border border-pink-100 p-3 shadow-sm shadow-pink-100/60">
        <div className="mb-2 flex items-center justify-between px-1">
          <div>
            <div className="text-xs font-semibold text-stone-700">収入と支出の推移</div>
            <div className="text-[11px] text-stone-500">ピンクが支出、グリーンが収入</div>
          </div>
          <div
            className={`num text-sm font-bold ${
              current.balance >= 0 ? "text-pink-600" : "text-rose-600"
            }`}
          >
            {formatYen(current.balance)}
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="#fce7f3" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#78716c" }}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value, name) => [
                  formatYen(Number(value)),
                  name === "income" ? "収入" : "支出",
                ]}
                labelFormatter={(label) => `${label}のデータ`}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 12,
                  border: "1px solid #fbcfe8",
                  boxShadow: "0 8px 24px rgba(244, 114, 182, 0.14)",
                }}
              />
              <Bar dataKey="income" fill="#86efac" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#fda4af" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function InsightStat({
  title,
  value,
  helper,
  icon,
  tone,
}: {
  title: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  tone: "normal" | "good" | "caution";
}) {
  const toneClass =
    tone === "good"
      ? "text-pink-600 bg-pink-50"
      : tone === "caution"
        ? "text-rose-600 bg-rose-50"
        : "text-stone-600 bg-stone-50";

  return (
    <div className="rounded-2xl bg-white/90 border border-pink-100 p-3 shadow-sm shadow-pink-100/60">
      <div
        className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full ${toneClass}`}
      >
        {icon}
      </div>
      <div className="text-[11px] font-medium text-stone-500">{title}</div>
      <div className="num mt-0.5 text-base font-bold text-stone-900">{value}</div>
      <div className="mt-1 text-[10px] text-stone-500">{helper}</div>
    </div>
  );
}
