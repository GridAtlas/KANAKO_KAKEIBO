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
          <section className="today-card mt-3 grid grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] items-center gap-2 rounded-[22px] border border-[var(--line)] p-3.5 sm:mt-5 sm:gap-4 sm:p-5">
            <TodayBudget day={getDailyBudgetStatus(today, today, goals, spending)} />
            <MiniKanako stage={getMiniKanakoStage(today, goals, spending)} outfit={activeOutfit} />
          </section>
          <nav aria-label="家計簿の詳細" className="mt-3 divide-y divide-[#f4e7e7] overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--surface)] sm:mt-4">
            <DetailLink href="/weekly" label="週間予算" icon={CalendarRange} tone="sage"
              detail={weeklyBalance === null ? undefined : `${weeklyBalance < 0 ? "超過" : "あと"} ${formatYen(Math.abs(weeklyBalance))}`}
            />
            <DetailLink href="/calendar" label="はなまるカレンダー" icon={Flower} tone="rose"
              detail={`今月 ${getDailyBudgetMonth(monthKeyOf(today), today, goals, spending).filter((day) => day.status === "achieved").length}日`}
            />
            <DetailLink href="/dashboard" label="月の家計簿" icon={NotebookPen} tone="gold" />
          </nav>
        </>
      ) : (
        <p className="mt-4 text-sm text-[var(--muted)]" role="status">読み込み中…</p>
      )}
    </main>
  );
}

function TodayBudget({ day }: { day: DailyBudgetDay }) {
  const { amount, goal } = day;
  const over = goal !== null && amount > goal;
  return (
    <div className="min-w-0">
      <h1 className="text-sm font-bold text-[var(--accent)] sm:text-base">今日の予算</h1>
      {goal === null ? (
        <>
          <Link href="/settings/daily-budget" className="tap-target mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-3 text-xs font-bold text-white hover:bg-[var(--accent-hover)] sm:px-4 sm:text-sm">
            目標を設定
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        </>
      ) : (
        <>
          <div className={over ? "mt-2 text-[var(--accent)]" : "mt-2 text-[var(--ink)]"}>
            <p className={`text-xs font-semibold sm:text-sm ${over ? "" : "text-[var(--muted)]"}`}>{over ? "予算オーバー" : "あと使える金額"}</p>
            <p className="break-all text-[clamp(2rem,8.7vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.045em] tabular-nums">
              {formatYen(Math.abs(goal - amount))}
            </p>
          </div>
          <p className="mt-1.5 flex flex-wrap gap-x-2 text-xs text-[var(--muted)]">
            <span className="break-all">支出 {formatYen(amount)}</span>
            <span className="break-all">目標 {formatYen(goal)}</span>
          </p>
          <Link href="/settings/daily-budget" className="tap-target -mb-1 inline-flex items-center gap-0.5 rounded-lg text-xs font-bold text-[var(--accent)] hover:underline sm:text-sm">
            目標を変更
            <ChevronRight size={15} aria-hidden="true" />
          </Link>
        </>
      )}
      {goal === null && amount > 0 && (
        <p className="mt-2 break-all text-xs text-[var(--muted)]">今日の支出 {formatYen(amount)}</p>
      )}
    </div>
  );
}

const detailTones = {
  sage: "bg-[#e9efe7] text-[var(--sage)]",
  rose: "bg-[#f9e5eb] text-[var(--accent)]",
  gold: "bg-[#f6ebd9] text-[var(--gold)]",
};

function DetailLink({ href, label, detail, icon: Icon, tone }: {
  href: string;
  label: string;
  detail?: string;
  icon: LucideIcon;
  tone: keyof typeof detailTones;
}) {
  return (
    <Link href={href} className="tap-target flex items-center gap-2.5 px-3 py-1.5 text-[var(--ink)] hover:bg-[#fcf1f4] sm:min-h-14 sm:gap-3 sm:px-4">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] ${detailTones[tone]}`}>
        <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-sm font-bold">{label}</span>
      {detail && <span className="max-w-[43%] break-all text-right text-xs font-semibold tabular-nums text-[var(--muted)] sm:text-sm">{detail}</span>}
      <ChevronRight size={15} className="shrink-0 text-[var(--muted)]" aria-hidden="true" />
    </Link>
  );
}
