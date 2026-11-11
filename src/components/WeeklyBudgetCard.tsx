import { CalendarRange } from "lucide-react";
import { formatYen } from "@/lib/money";
import type { WeeklyBudget } from "@/lib/weeklyBudget";

export function WeeklyBudgetCard({ week }: { week: WeeklyBudget }) {
  const { budget, days, spent, carriedBalance, todayBalance } = week;
  const remaining = budget === null ? 0 : budget - spent;
  const over = remaining < 0;
  const progress = budget === null ? 0 : budget === 0 ? (spent > 0 ? 100 : 0) : Math.min((spent / budget) * 100, 100);

  return (
    <section className="min-w-0 rounded-[24px] border border-[#dbe3d2] bg-[#f1f5eb] px-4 py-4 text-[#334736] sm:px-5 sm:py-5">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <CalendarRange size={19} className="text-[#4b6a4e]" aria-hidden="true" />
          週間予算
        </h2>
        <p className="text-xs font-semibold text-[#536a54]">
          {formatWeekDate(days[0].date)}（月）〜 {formatWeekDate(days[6].date)}（日）
        </p>
      </div>
      {budget === null ? (
        <p className="mt-2 text-sm leading-relaxed text-[#536a54]">
          1日の目標を決めると、今週使える金額と使い残しがわかります。
        </p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div className={over ? "text-[#a13e34]" : undefined}>
              <p className="text-xs font-bold">{over ? "今週の予算オーバー" : "今週あと使える金額"}</p>
              <p className="mt-0.5 break-all text-[clamp(1.65rem,6vw,2.25rem)] font-bold leading-tight tracking-tight tabular-nums">
                {formatYen(Math.abs(remaining))}
              </p>
            </div>
            <p className="break-all text-xs font-medium text-[#536a54]">
              支出 <span className="font-bold tabular-nums">{formatYen(spent)}</span>
              {" / "}予算 <span className="font-bold tabular-nums">{formatYen(budget)}</span>
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="週間予算の消化率"
            aria-valuenow={Math.round(progress)}
            aria-valuetext={`${formatYen(budget)}のうち${formatYen(spent)}を使用`}
            className="mt-2 h-2 overflow-hidden rounded-full bg-[#dfe8d9]"
          >
            <div className={`h-full rounded-full motion-safe:transition-[width] ${over ? "bg-[#a13e34]" : "bg-[#698969]"}`} style={{ width: `${progress}%` }} />
          </div>
          <dl className="mt-3 space-y-1 border-t border-[#dbe3d2] pt-2 text-xs sm:text-sm">
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-[#536a54]">{carriedBalance < 0 ? "昨日までの超過" : "昨日までの繰り越し"}</dt>
              <dd className="break-all text-right font-bold tabular-nums">{formatYen(Math.abs(carriedBalance))}</dd>
            </div>
            {carriedBalance !== 0 && todayBalance !== null && (
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-[#536a54]">{todayBalance < 0 ? "繰り越し反映後の今日の超過" : "繰り越し反映後の今日の残り"}</dt>
                <dd className={`break-all text-right font-bold tabular-nums ${todayBalance < 0 ? "text-[#a13e34]" : ""}`}>{formatYen(Math.abs(todayBalance))}</dd>
              </div>
            )}
          </dl>
          <p className="mt-2 text-xs leading-relaxed text-[#536a54]">
            日ごとの目標を合計。使い残しは日曜まで使えます。はなまるは日ごとの目標で判定します。
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
