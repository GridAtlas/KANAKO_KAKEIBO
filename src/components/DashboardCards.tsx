import { formatYen } from "@/lib/money";
import type { MonthlyTotals } from "@/types";

interface Props {
  totals: MonthlyTotals;
  fixedExpense: number;
  variableExpense: number;
}

export function DashboardCards({ totals, fixedExpense, variableExpense }: Props) {
  return (
    <section aria-label="月の収支" className="rounded-2xl border border-[#eadccf] bg-[#fffdf8] px-3.5 py-3 text-[#3b2721] sm:px-5">
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5">
        <div className="col-span-2 min-w-0 border-b border-[#eadccf] pb-2">
          <dt className="text-xs font-semibold text-[#765b50]">支出</dt>
          <dd className="break-words text-[clamp(1.55rem,7vw,2rem)] font-bold leading-none tracking-tight text-[#a13e34] tabular-nums">
            {formatYen(totals.expense)}
          </dd>
        </div>
        <SummaryValue label="固定費" amount={fixedExpense} />
        <SummaryValue label="変動費" amount={variableExpense} />
        <SummaryValue label="収入" amount={totals.income} tone="income" />
        <SummaryValue label="収支" amount={totals.balance} tone={totals.balance < 0 ? "expense" : "income"} />
      </dl>
    </section>
  );
}

function SummaryValue({
  label,
  amount,
  tone,
}: {
  label: string;
  amount: number;
  tone?: "income" | "expense";
}) {
  const color = tone === "income" ? "text-[#3a6543]" : tone === "expense" ? "text-[#a13e34]" : "";

  return (
    <div className="min-w-0">
      <dt className="text-xs text-[#765b50]">{label}</dt>
      <dd className={`break-words text-sm font-bold tabular-nums ${color}`}>{formatYen(amount)}</dd>
    </div>
  );
}
