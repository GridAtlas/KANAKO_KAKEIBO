import Link from "next/link";
import { ArrowRight, CalendarRange } from "lucide-react";
import { formatYen } from "@/lib/money";
import type { WeeklyBudget } from "@/lib/weeklyBudget";

export function WeeklyBudgetCard({ week }: { week: WeeklyBudget }) {
  const { budget, days, spent, carriedBalance, todayBalance } = week;
  const remaining = budget === null ? 0 : budget - spent;
  const over = remaining < 0;
  const progress = budget === null ? 0 : budget === 0 ? (spent > 0 ? 100 : 0) : Math.min((spent / budget) * 100, 100);

  return (
    <section aria-labelledby="weekly-budget-title" className="min-w-0 rounded-[24px] border border-[#d9e3d7] bg-[linear-gradient(155deg,#f0f5ec_0%,var(--surface)_58%)] p-4 text-[var(--ink)] shadow-[0_6px_20px_rgba(64,38,45,0.06)] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <h1 id="weekly-budget-title" className="display-type flex items-center gap-1.5 text-lg font-bold">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#e2ece0] text-[var(--sage)]" aria-hidden="true">
            <CalendarRange size={16} strokeWidth={1.7} />
          </span>
          週間予算
        </h1>
        <p className="rounded-full border border-[#d9e3d7] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-semibold text-[var(--sage)]">
          {formatWeekDate(days[0].date)} (月) 〜 {formatWeekDate(days[6].date)} (日)
        </p>
      </div>
      {budget === null ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            1日の目標を設定すると、今週の予算が表示されます。
          </p>
          <Link href="/settings/daily-budget" className="tap-target mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--sage)] px-3 text-sm font-bold text-white hover:bg-[#425d49]">
            目標を設定
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </>
      ) : (
        <>
          <div className={`mt-3 ${over ? "text-[var(--accent)]" : "text-[var(--sage)]"}`}>
            <p className="text-xs font-bold tracking-wide">{over ? "今週の予算超過" : "今週の残り予算"}</p>
            <p className="display-type mt-1 break-words text-[clamp(2.15rem,8vw,2.85rem)] font-bold leading-none tracking-tight tabular-nums">
              {formatYen(Math.abs(remaining))}
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="週間予算の消化率"
            aria-valuenow={Math.round(progress)}
            aria-valuetext={`${formatYen(budget)}のうち${formatYen(spent)}を使用`}
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e1ebe0]"
          >
            <div className={`h-full rounded-full ${over ? "bg-[var(--accent)]" : "bg-[var(--sage)]"}`} style={{ width: `${progress}%` }} />
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div className="min-w-0">
              <dt className="text-xs text-[var(--muted)]">今週の支出</dt>
              <dd className="break-words font-bold tabular-nums">{formatYen(spent)}</dd>
            </div>
            <div className="min-w-0 text-right">
              <dt className="text-xs text-[var(--muted)]">今週の予算</dt>
              <dd className="break-words font-bold tabular-nums">{formatYen(budget)}</dd>
            </div>
          </dl>
          <dl className="mt-3 space-y-1.5 border-t border-[#d9e3d7] pt-2.5 text-sm">
            <div className="flex items-baseline justify-between gap-2">
              <dt>{carriedBalance < 0 ? "昨日までの超過" : "昨日までの繰り越し"}</dt>
              <dd className={`min-w-0 break-words text-right font-bold tabular-nums ${carriedBalance < 0 ? "text-[var(--accent)]" : "text-[var(--sage)]"}`}>{formatYen(Math.abs(carriedBalance))}</dd>
            </div>
            {carriedBalance !== 0 && todayBalance !== null && (
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-[var(--muted)]">
                  {todayBalance < 0 ? "今日の超過" : "今日の残り"}<span className="text-xs">（繰り越し込み）</span>
                </dt>
                <dd className={`min-w-0 break-words text-right font-bold tabular-nums ${todayBalance < 0 ? "text-[var(--accent)]" : ""}`}>{formatYen(Math.abs(todayBalance))}</dd>
              </div>
            )}
          </dl>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
            予算は1日の目標の合計。使い残しは日曜まで。
            <br />はなまるは1日の目標で判定します。
          </p>
        </>
      )}
    </section>
  );
}

function formatWeekDate(date: string): string {
  const [, month, day] = date.split("-").map(Number);
  return `${month}/${day}`;
}
