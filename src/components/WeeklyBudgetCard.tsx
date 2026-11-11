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
    <section aria-labelledby="weekly-budget-title" className="min-w-0 rounded-[24px] border border-[#dbe3d2] bg-[#f1f5eb] p-4 text-[#334736] sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <h1 id="weekly-budget-title" className="flex items-center gap-1.5 text-lg font-bold">
          <CalendarRange size={18} className="text-[#4b6a4e]" aria-hidden="true" />
          週間予算
        </h1>
        <p className="text-xs font-semibold text-[#536a54]">
          {formatWeekDate(days[0].date)} (月) 〜 {formatWeekDate(days[6].date)} (日)
        </p>
      </div>
      {budget === null ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-[#536a54]">
            1日の目標を設定すると、今週の予算が表示されます。
          </p>
          <Link href="/settings/daily-budget" className="tap-target mt-3 inline-flex items-center gap-2 rounded-xl bg-[#4b6a4e] px-3 text-sm font-bold text-white hover:bg-[#3a563e]">
            目標を設定
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </>
      ) : (
        <>
          <div className={`mt-3 ${over ? "text-[#a13e34]" : "text-[#334736]"}`}>
            <p className="text-sm font-semibold">{over ? "今週の予算超過" : "今週の残り予算"}</p>
            <p className="mt-0.5 break-words text-[clamp(1.75rem,7vw,2.4rem)] font-bold leading-none tracking-tight tabular-nums">
              {formatYen(Math.abs(remaining))}
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="週間予算の消化率"
            aria-valuenow={Math.round(progress)}
            aria-valuetext={`${formatYen(budget)}のうち${formatYen(spent)}を使用`}
            className="mt-3 h-2 overflow-hidden rounded-full bg-[#dfe8d9]"
          >
            <div className={`h-full rounded-full motion-safe:transition-[width] ${over ? "bg-[#a13e34]" : "bg-[#698969]"}`} style={{ width: `${progress}%` }} />
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div className="min-w-0">
              <dt className="text-xs text-[#536a54]">今週の支出</dt>
              <dd className="break-words font-bold tabular-nums">{formatYen(spent)}</dd>
            </div>
            <div className="min-w-0 text-right">
              <dt className="text-xs text-[#536a54]">今週の予算</dt>
              <dd className="break-words font-bold tabular-nums">{formatYen(budget)}</dd>
            </div>
          </dl>
          <dl className="mt-3 space-y-1.5 border-t border-[#dbe3d2] pt-2.5 text-sm">
            <div className="flex items-baseline justify-between gap-2">
              <dt>{carriedBalance < 0 ? "昨日までの超過" : "昨日までの繰り越し"}</dt>
              <dd className={`min-w-0 break-words text-right font-bold tabular-nums ${carriedBalance < 0 ? "text-[#a13e34]" : ""}`}>{formatYen(Math.abs(carriedBalance))}</dd>
            </div>
            {carriedBalance !== 0 && todayBalance !== null && (
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-[#536a54]">
                  {todayBalance < 0 ? "今日の超過" : "今日の残り"}<span className="text-xs">（繰り越し込み）</span>
                </dt>
                <dd className={`min-w-0 break-words text-right font-bold tabular-nums ${todayBalance < 0 ? "text-[#a13e34]" : ""}`}>{formatYen(Math.abs(todayBalance))}</dd>
              </div>
            )}
          </dl>
          <p className="mt-2 text-xs leading-relaxed text-[#536a54]">
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
