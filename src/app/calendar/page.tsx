"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { BudgetDayMark, budgetDayLabel } from "@/components/BudgetDayMark";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { Modal } from "@/components/Modal";
import { getDailyBudgetMonth, getDailyBudgetStatus, type DailyBudgetDay } from "@/lib/dailyBudget";
import { formatDateShort, formatMonthLabel, monthKeyOf, parseMonthKey, shiftMonthKey } from "@/lib/date";
import { formatYen } from "@/lib/money";
import { useDailyBudget } from "@/lib/useDailyBudget";

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];
const legendStatuses = ["achieved", "over", "pending"] as const;

export default function CalendarPage() {
  const { today, goals, spending } = useDailyBudget();
  const [chosenMonth, setChosenMonth] = useState<string>();
  const [chosenDate, setChosenDate] = useState<string>();
  const currentMonth = today && monthKeyOf(today);
  const month = chosenMonth ?? currentMonth;

  function changeMonth(nextMonth: string) {
    setChosenMonth(nextMonth === currentMonth ? undefined : nextMonth);
  }

  const days = today && month ? getDailyBudgetMonth(month, today, goals, spending) : [];
  const selected = today && chosenDate ? getDailyBudgetStatus(chosenDate, today, goals, spending) : undefined;
  const achieved = days.filter((day) => day.status === "achieved").length;

  return (
    <main className="wide-page compact-page w-full px-3 py-2 sm:px-6 md:pt-6">
      <BudgetPageHeader />
      <div className="mx-auto max-w-xl md:mt-4">
        <div className="flex min-h-11 items-center justify-between gap-2 sm:mb-2">
          <h1 className="text-lg font-extrabold tracking-tight text-[var(--ink)] sm:text-2xl">
            はなまるカレンダー
          </h1>
          {month && (
            <p className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#eac4cf] bg-[#fff2f5] py-0.5 pl-1.5 pr-2.5 text-xs font-bold text-[var(--accent)] sm:text-sm">
              <span className="grid h-5 w-5 scale-75 place-items-center"><BudgetDayMark status="achieved" /></span>
              <span className="sr-only">はなまる </span>
              <span className="tabular-nums">{achieved}日</span>
            </p>
          )}
        </div>
        {today && month ? (
          <section aria-label="月間カレンダー" className="-mx-3 border-y border-[var(--line)] bg-[var(--surface)] px-1 shadow-[0_8px_24px_rgba(96,45,57,0.06)] min-[369px]:mx-0 min-[369px]:rounded-[22px] min-[369px]:border-x min-[369px]:px-2 sm:px-5 sm:py-3">
            <div className="flex items-center justify-between gap-1">
              <button type="button" onClick={() => changeMonth(shiftMonthKey(month, -1))} aria-label="前の月" className="tap-target grid place-items-center rounded-xl text-[var(--accent)] hover:bg-[#fbedf0]">
                <ChevronLeft size={21} aria-hidden="true" />
              </button>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold tabular-nums text-[var(--ink)] sm:text-lg" aria-live="polite">{formatMonthLabel(month)}</h2>
                {month !== currentMonth && (
                  <button type="button" onClick={() => changeMonth(monthKeyOf(today))} className="tap-target rounded-lg px-1.5 text-xs font-bold text-[var(--accent)] hover:bg-[#fbedf0]">
                    今月へ
                  </button>
                )}
              </div>
              <button type="button" onClick={() => changeMonth(shiftMonthKey(month, 1))} disabled={month === currentMonth} aria-label="次の月" className="tap-target grid place-items-center rounded-xl text-[var(--accent)] enabled:hover:bg-[#fbedf0] disabled:text-[#b9a2a8]">
                <ChevronRight size={21} aria-hidden="true" />
              </button>
            </div>
            <CalendarGrid days={days} month={month} today={today} onSelect={setChosenDate} />
            <div className="mt-1 border-t border-[var(--line)] px-2 sm:mt-2 sm:pt-1">
              {goals.length ? (
                <ul className="flex min-h-8 flex-wrap items-center justify-center gap-x-4 text-[11px] font-semibold text-[var(--muted)] sm:text-xs" aria-label="カレンダーの凡例">
                  {legendStatuses.map((status) => (
                    <li key={status} className="flex items-center gap-1">
                      <span className="grid h-6 w-6 scale-75 place-items-center"><BudgetDayMark status={status} /></span>
                      {budgetDayLabel[status]}
                    </li>
                  ))}
                </ul>
              ) : (
                <Link href="/settings/daily-budget" className="tap-target mx-auto flex w-fit items-center gap-2 rounded-lg text-sm font-bold text-[var(--accent)] hover:underline">
                  1日の目標を設定
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
          </section>
        ) : (
          <p className="text-sm text-[var(--muted)]" role="status">読み込み中…</p>
        )}
      </div>
      {selected && <DayDetails day={selected} onClose={() => setChosenDate(undefined)} />}
    </main>
  );
}

function CalendarGrid({
  days,
  month,
  today,
  onSelect,
}: {
  days: DailyBudgetDay[];
  month: string;
  today: string;
  onSelect: (date: string) => void;
}) {
  const { year, month: monthNumber } = parseMonthKey(month);
  const leading = (new Date(year, monthNumber - 1, 1).getDay() + 6) % 7;
  return (
    <div className="grid grid-cols-7 gap-y-px">
      {WEEKDAYS.map((weekday) => (
        <span key={weekday} className="bg-[#f9eef0] py-1 text-center text-xs font-bold text-[var(--muted)] first:rounded-l-lg [&:nth-child(6)]:text-[var(--sage)] [&:nth-child(7)]:rounded-r-lg [&:nth-child(7)]:text-[var(--accent)]">{weekday}</span>
      ))}
      {Array.from({ length: leading }, (_, index) => <span key={index} aria-hidden="true" />)}
      {days.map((day) => {
        const isToday = day.date === today;
        return (
          <button
            key={day.date}
            type="button"
            onClick={(event) => {
              event.currentTarget.focus();
              onSelect(day.date);
            }}
            disabled={day.status === "future"}
            aria-current={isToday ? "date" : undefined}
            aria-haspopup="dialog"
            aria-label={`${formatDateShort(day.date)} ${budgetDayLabel[day.status]}`}
            className={`flex min-h-11 w-full flex-col items-center justify-center rounded-xl border text-xs font-bold tabular-nums sm:min-h-14 sm:text-sm ${
              isToday ? "border-[#ce8fa0] bg-[#fae6ed] text-[var(--accent)]"
                : "border-transparent text-[var(--ink)] enabled:hover:bg-[#fbedf0] disabled:text-[#8e7a7f]"
            }`}
          >
            {Number(day.date.slice(-2))}
            <span className="grid h-5 place-items-center">
              {day.status !== "future" && day.status !== "unconfigured" && <BudgetDayMark status={day.status} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DayDetails({ day, onClose }: { day: DailyBudgetDay; onClose: () => void }) {
  return (
    <Modal onClose={onClose} labelledBy="calendar-day-title" className="rounded-[22px] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="calendar-day-title" className="text-lg font-extrabold">{formatDateShort(day.date)}</h2>
        <button type="button" onClick={onClose} className="tap-target grid place-items-center rounded-lg text-[var(--muted)] hover:bg-[#fbedf0]" aria-label="閉じる">
          <X size={22} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-[#f9eef0] px-2.5 py-0.5 text-xs font-bold text-[var(--muted)]">
        <BudgetDayMark status={day.status} />
        {budgetDayLabel[day.status]}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-b border-[var(--line)] pb-3">
        <div>
          <dt className="text-xs font-semibold text-[var(--muted)]">支出（固定費を除く）</dt>
          <dd className="mt-1 break-all text-xl font-bold tabular-nums">{formatYen(day.amount)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-[var(--muted)]">その日の目標</dt>
          <dd className="mt-1 break-all text-xl font-bold tabular-nums">{day.goal === null ? "未設定" : formatYen(day.goal)}</dd>
        </div>
      </dl>
      <Link href={`/history?date=${day.date}`} className="tap-target mt-1 flex w-fit items-center gap-2 rounded-lg text-sm font-bold text-[var(--accent)] hover:underline">
        この日の履歴を見る
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </Modal>
  );
}
