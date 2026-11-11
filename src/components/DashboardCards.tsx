import { formatYen } from "@/lib/money";
import type { MonthlyTotals } from "@/types";

interface Props {
  totals: MonthlyTotals;
  fixedExpense: number;
  variableExpense: number;
}

export function DashboardCards({ totals, fixedExpense, variableExpense }: Props) {
  return (
    <section aria-label="月の収支" className="rounded-2xl border border-[var(--line)] bg-[linear-gradient(155deg,#fbe9ee_0%,var(--surface)_53%)] px-3.5 py-3 text-[var(--ink)] shadow-[0_5px_16px_rgba(64,38,45,0.05)] sm:px-5">
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5">
        <div className="col-span-2 min-w-0 border-b border-[var(--line)] pb-2">
          <dt className="text-xs font-bold tracking-wide text-[var(--muted)]">支出</dt>
          <dd className="display-type mt-0.5 break-words text-[clamp(1.9rem,8vw,2.55rem)] font-bold leading-none tracking-tight text-[var(--accent)] tabular-nums">
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
  const color = tone === "income" ? "text-[var(--sage)]" : tone === "expense" ? "text-[var(--accent)]" : "";

  return (
    <div className="min-w-0">
      <dt className="text-xs text-[var(--muted)]">{label}</dt>
      <dd className={`break-words text-sm font-bold tabular-nums ${color}`}>{formatYen(amount)}</dd>
    </div>
  );
}
