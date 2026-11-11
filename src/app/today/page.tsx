"use client";

import Link from "next/link";
import { CalendarRange, ChevronRight, Flower, NotebookPen, type LucideIcon } from "lucide-react";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { MiniKanako } from "@/components/MiniKanako";
import { getDailyBudgetMonth, getDailyBudgetStatus, getMiniKanakoStage, type DailyBudgetDay } from "@/lib/dailyBudget";
import { formatDateShort, monthKeyOf } from "@/lib/date";
import { formatYen } from "@/lib/money";
import { useDailyBudget } from "@/lib/useDailyBudget";
import { useWardrobe } from "@/lib/useWardrobe";
import { getWeeklyBudget } from "@/lib/weeklyBudget";

export default function TodayPage() {
  const { today, goals, spending } = useDailyBudget();
  const { activeOutfit } = useWardrobe(today, goals, spending);
  const week = today ? getWeeklyBudget(today, goals, spending) : null;
  const weeklyBalance = week && week.budget !== null ? week.budget - week.spent : null;

  return (
    <main className="wide-page compact-page mx-auto w-full max-w-2xl px-3 py-2 sm:px-5 sm:py-5">
      <BudgetPageHeader dateLabel={today && formatDateShort(today)} />
      {today ? (
        <>
          <section className="mt-3 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center gap-2 rounded-[22px] border border-[#eadccf] bg-[#fffdf9] p-3 sm:mt-4 sm:gap-4 sm:p-5">
            <TodayBudget day={getDailyBudgetStatus(today, today, goals, spending)} />
            <MiniKanako stage={getMiniKanakoStage(today, goals, spending)} outfit={activeOutfit} />
          </section>
          <nav aria-label="家計簿の詳細" className="mt-3 divide-y divide-[#f0e5db] overflow-hidden rounded-[20px] border border-[#eadccf] bg-[#fffdf9] sm:mt-4">
            <DetailLink href="/weekly" label="週間予算" icon={CalendarRange}
              detail={weeklyBalance === null ? undefined : `${weeklyBalance < 0 ? "超過" : "あと"} ${formatYen(Math.abs(weeklyBalance))}`}
            />
            <DetailLink href="/calendar" label="はなまるカレンダー" icon={Flower}
              detail={`今月 ${getDailyBudgetMonth(monthKeyOf(today), today, goals, spending).filter((day) => day.status === "achieved").length}日`}
            />
            <DetailLink href="/dashboard" label="月の家計簿" icon={NotebookPen} />
          </nav>
        </>
      ) : (
        <p className="mt-4 text-sm text-[#765b50]" role="status">読み込み中…</p>
      )}
    </main>
  );
}

function TodayBudget({ day }: { day: DailyBudgetDay }) {
  const { amount, goal } = day;
  const over = goal !== null && amount > goal;
  return (
    <div className="min-w-0">
      <h1 className="text-sm font-bold text-[#3b2721] sm:text-base">今日の予算</h1>
      {goal === null ? (
        <>
          <p className="mt-2 text-sm leading-snug text-[#765b50]">1日に使える金額を決める</p>
          <Link href="/settings/daily-budget" className="tap-target mt-2 inline-flex items-center gap-1 rounded-lg bg-[#a13e34] px-2.5 text-xs font-bold text-white hover:bg-[#862e28] sm:px-3 sm:text-sm">
            目標を設定
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        </>
      ) : (
        <>
          <div className={over ? "mt-2 text-[#a13e34]" : "mt-2 text-[#3b2721]"}>
            <p className="text-xs font-semibold sm:text-sm">{over ? "予算オーバー" : "あと使える金額"}</p>
            <p className="break-all text-[clamp(1.8rem,8vw,3.25rem)] font-bold leading-tight tracking-tight tabular-nums">
              {formatYen(Math.abs(goal - amount))}
            </p>
          </div>
          <p className="mt-1 flex flex-wrap gap-x-2 text-xs text-[#765b50]">
            <span className="break-all">支出 {formatYen(amount)}</span>
            <span className="break-all">目標 {formatYen(goal)}</span>
          </p>
          <Link href="/settings/daily-budget" className="tap-target -mb-1 inline-flex items-center gap-0.5 rounded-lg text-xs font-bold text-[#983e34] hover:underline sm:text-sm">
            目標を変更
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        </>
      )}
      {goal === null && amount > 0 && (
        <p className="mt-2 break-all text-xs text-[#765b50]">今日の支出 {formatYen(amount)}</p>
      )}
    </div>
  );
}

function DetailLink({ href, label, detail, icon: Icon }: {
  href: string;
  label: string;
  detail?: string;
  icon: LucideIcon;
}) {
  return (
    <Link href={href} className="tap-target flex items-center gap-2 px-3 py-2 text-[#3b2721] hover:bg-[#faf2ea] sm:min-h-14 sm:gap-3 sm:px-4">
      <Icon size={18} className="shrink-0 text-[#a13e34]" aria-hidden="true" />
      <span className="min-w-0 flex-1 text-sm font-bold">{label}</span>
      {detail && <span className="max-w-[45%] break-all text-right text-xs font-semibold text-[#765b50] sm:text-sm">{detail}</span>}
      <ChevronRight size={16} className="shrink-0 text-[#765b50]" aria-hidden="true" />
    </Link>
  );
}
