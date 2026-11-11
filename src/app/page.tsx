"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Flower, NotebookPen, Target, TrendingUp } from "lucide-react";
import { BudgetDayMark, budgetDayLabel } from "@/components/BudgetDayMark";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { MiniKanako } from "@/components/MiniKanako";
import { WeeklyBudgetCard } from "@/components/WeeklyBudgetCard";
import { getDailyBudgetMonth, getDailyBudgetStatus, getMiniKanakoStage, type DailyBudgetDay } from "@/lib/dailyBudget";
import { formatDateShort, monthKeyOf } from "@/lib/date";
import { formatYen } from "@/lib/money";
import { useDailyBudget } from "@/lib/useDailyBudget";
import { getWeeklyBudget } from "@/lib/weeklyBudget";

export default function HomePage() {
  const { today, goals, spending } = useDailyBudget();
  const week = today ? getWeeklyBudget(today, goals, spending) : null;

  return (
    <main className="wide-page w-full px-4 pb-8 pt-3 sm:px-6 md:pt-6">
      <BudgetPageHeader dateLabel={today && formatDateShort(today)} />
      {today && week ? (
        <>
          <div className="mt-5 grid gap-4 md:mt-7 md:grid-cols-[1.12fr_1fr] md:gap-5">
            <TodayBudget day={getDailyBudgetStatus(today, today, goals, spending)} />
            <MiniKanako stage={getMiniKanakoStage(today, goals, spending)} hasGoal={goals.length > 0} />
          </div>
          <div className="mt-4 grid items-start gap-4 md:mt-5 md:grid-cols-[1.12fr_1fr] md:gap-5">
            <WeeklyBudgetCard week={week} />
            <div className="grid gap-4 md:gap-5">
              <WeekPreview
                today={today}
                achieved={getDailyBudgetMonth(monthKeyOf(today), today, goals, spending).filter((day) => day.status === "achieved").length}
                days={week.days}
              />
              <section className="overflow-hidden rounded-[24px] border border-[#eadccf] bg-[#fffdf9] px-4 sm:px-5" aria-label="家計の振り返り">
                <HomeAction href="/dashboard" title="月の家計簿" description="収支・支出の内訳" icon={NotebookPen} />
                <HomeAction href="/trends" title="月ごとの推移" description="6か月の収支・貯金率" icon={TrendingUp} />
              </section>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-6 text-sm text-[#765b50]" role="status">読み込み中…</p>
      )}
    </main>
  );
}

function TodayBudget({ day }: { day: DailyBudgetDay }) {
  const { amount, goal } = day;
  const over = goal !== null && amount > goal;
  const remaining = goal === null ? 0 : Math.abs(goal - amount);
  const progress = goal === null ? 0 : goal === 0 ? (amount > 0 ? 100 : 0) : Math.min((amount / goal) * 100, 100);

  return (
    <section className="flex min-w-0 flex-col justify-between rounded-[26px] border border-[#eadccf] bg-[#fffdf9] p-5 shadow-[0_8px_24px_rgba(94,58,33,0.055)] sm:p-7">
      <div className="flex items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-base font-bold text-[#3b2721]">
          <Target size={19} className="text-[#a13e34]" aria-hidden="true" />
          今日の予算
        </h1>
        {goal !== null && (
          <Link href="/settings/daily-budget" className="tap-target -my-2 inline-flex items-center gap-0.5 rounded-lg px-1 text-xs font-bold text-[#983e34] hover:bg-[#faede6]">
            目標を変更
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
      {goal === null ? (
        <div className="mt-5">
          <h2 className="text-[clamp(1.45rem,5vw,2.1rem)] font-bold leading-tight tracking-tight text-[#3b2721]">
            1日の目標を決めよう
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#765b50]">今日あといくら使えるか、ひと目でわかります。</p>
          <Link href="/settings/daily-budget" className="tap-target mt-4 inline-flex items-center gap-2 rounded-xl bg-[#a13e34] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#862e28]">
            目標を設定
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <p className={`text-sm font-semibold ${over ? "text-[#a13e34]" : "text-[#765b50]"}`}>
            {over ? "今日の予算オーバー" : "今日あと使える金額"}
          </p>
          <p className={`mt-1 break-words text-[clamp(2rem,8vw,3.5rem)] font-bold leading-none tracking-tight tabular-nums ${over ? "text-[#a13e34]" : "text-[#3b2721]"}`}>
            {formatYen(remaining)}
          </p>
          <div
            className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#f1e3d8]"
            role="progressbar"
            aria-label="今日の予算の消化率"
            aria-valuenow={Math.round(progress)}
            aria-valuetext={`${formatYen(goal)}のうち${formatYen(amount)}を使用`}
          >
            <div className={`h-full rounded-full transition-[width] ${over ? "bg-[#a13e34]" : "bg-[#bd7953]"}`} style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      <dl className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm text-[#765b50]">
        <div className="flex items-baseline gap-1.5">
          <dt>今日の支出</dt>
          <dd className="break-all font-bold tabular-nums text-[#3b2721]">{formatYen(amount)}</dd>
        </div>
        {goal !== null && (
          <div className="flex items-baseline gap-1.5">
            <dt>目標</dt>
            <dd className="break-all font-bold tabular-nums text-[#3b2721]">{formatYen(goal)}</dd>
          </div>
        )}
      </dl>
      <p className="mt-1.5 text-xs text-[#765b50]">固定費を除く</p>
    </section>
  );
}

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];

function WeekPreview({
  today,
  achieved,
  days,
}: {
  today: string;
  achieved: number;
  days: DailyBudgetDay[];
}) {
  return (
    <section className="min-w-0 rounded-[24px] border border-[#eadccf] bg-[#fffdf9] px-4 pb-4 pt-2 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-x-2">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#3b2721] sm:text-base">
          <Flower size={19} className="text-[#a13e34]" aria-hidden="true" />
          今月のはなまる
          <span className="tabular-nums text-[#a13e34]">{achieved}日</span>
        </h2>
        <Link href="/calendar" className="tap-target inline-flex items-center gap-1 rounded-lg text-xs font-bold text-[#983e34] hover:underline">
          <CalendarDays size={15} aria-hidden="true" />
          カレンダー
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <ol className="grid grid-cols-7 gap-1" aria-label="今週の記録">
        {days.map(({ date, status }, index) => {
          return (
            <li key={date} className="text-center" aria-label={`${formatDateShort(date)} ${budgetDayLabel[status]}`}>
              <div aria-hidden="true" className="text-[11px] font-medium text-[#765b50]">{WEEKDAYS[index]}</div>
              <div aria-hidden="true" className={`mt-1 grid h-9 place-items-center rounded-lg ${date === today ? "border border-[#bc7c6e] bg-[#f9eee5]" : "bg-[#faf4ed]"}`}>
                <BudgetDayMark status={status} />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function HomeAction({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: typeof NotebookPen;
}) {
  return (
    <Link href={href} className="tap-target flex items-center gap-3 py-3 text-[#3b2721] first:border-b first:border-[#f0e5db] hover:text-[#983e34]">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f8ebe1] text-[#983e34]">
        <Icon size={17} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{title}</span>
        <span className="block text-xs text-[#765b50]">{description}</span>
      </span>
      <ChevronRight size={17} aria-hidden="true" />
    </Link>
  );
}
