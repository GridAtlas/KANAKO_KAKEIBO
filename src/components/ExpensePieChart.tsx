"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { colorHex } from "@/lib/colors";
import { formatYen } from "@/lib/money";
import type { CategoryTotal } from "@/types";

interface Props {
  data: CategoryTotal[];
}

export function ExpensePieChart({ data }: Props) {
  const expenseOnly = data.filter((d) => d.category.type === "expense");

  if (expenseOnly.length === 0) {
    return (
      <div className="rounded-2xl bg-white/90 border border-pink-100 p-6 text-center text-sm text-stone-400">
        今月のデータはまだありません
      </div>
    );
  }

  const chartData = expenseOnly.map((d) => ({
    name: d.category.name,
    value: d.total,
    color: colorHex(d.category.color),
  }));

  return (
    <div className="rounded-2xl bg-white/90 border border-pink-100 p-3 shadow-sm shadow-pink-100/60">
      <div className="text-xs text-stone-500 mb-1 px-1">支出の内訳</div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => formatYen(v)}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #fbcfe8",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* 凡例 */}
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs px-1">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: d.color }}
            />
            <span className="truncate">{d.name}</span>
            <span className="num ml-auto text-stone-500">
              {formatYen(d.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
