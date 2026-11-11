"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Flower, X } from "lucide-react";
import { BudgetDayMark, budgetDayLabel } from "@/components/BudgetDayMark";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
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
          <h1 className="text-lg font-bold tracking-tight text-[#3b2721] sm:text-2xl">
            はなまるカレンダー
          </h1>
          {month && (
            <p className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#f5e2d8] px-2.5 py-1 text-xs font-bold text-[#983e34] sm:text-sm">
              <Flower size={16} aria-hidden="true" />
              <span className="sr-only">はなまる </span>
              <span className="tabular-nums">{achieved}日</span>
            </p>
          )}
        </div>
        {today && month ? (
          <section aria-label="月間カレンダー" className="-mx-3 border-y border-[#eadccf] bg-[#fffdf9] px-1 min-[369px]:mx-0 min-[369px]:rounded-2xl min-[369px]:border-x min-[369px]:px-2 sm:px-5 sm:py-3">
            <div className="flex items-center justify-between gap-1">
              <button type="button" onClick={() => changeMonth(shiftMonthKey(month, -1))} aria-label="前の月" className="tap-target grid place-items-center rounded-xl text-[#983e34] hover:bg-[#f8ebe1]">
                <ChevronLeft size={21} aria-hidden="true" />
              </button>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-[#3b2721] sm:text-lg" aria-live="polite">{formatMonthLabel(month)}</h2>
                {month !== currentMonth && (
                  <button type="button" onClick={() => changeMonth(monthKeyOf(today))} className="tap-target rounded-lg px-1.5 text-xs font-bold text-[#983e34] hover:bg-[#f8ebe1]">
                    今月へ
                  </button>
                )}
              </div>
              <button type="button" onClick={() => changeMonth(shiftMonthKey(month, 1))} disabled={month === currentMonth} aria-label="次の月" className="tap-target grid place-items-center rounded-xl text-[#983e34] enabled:hover:bg-[#f8ebe1] disabled:text-[#bda99b]">
                <ChevronRight size={21} aria-hidden="true" />
              </button>
            </div>
            <CalendarGrid days={days} month={month} today={today} onSelect={setChosenDate} />
            <div className="mt-1 border-t border-[#f0e5db] px-2 sm:mt-2 sm:pt-1">
              {goals.length ? (
                <ul className="flex min-h-8 flex-wrap items-center justify-center gap-x-4 text-[11px] font-semibold text-[#765b50] sm:text-xs" aria-label="カレンダーの凡例">
                  {legendStatuses.map((status) => (
                    <li key={status} className="flex items-center gap-1">
                      <span className="grid h-6 w-6 scale-75 place-items-center"><BudgetDayMark status={status} /></span>
                      {budgetDayLabel[status]}
                    </li>
                  ))}
                </ul>
              ) : (
                <Link href="/settings/daily-budget" className="tap-target mx-auto flex w-fit items-center gap-2 rounded-lg text-sm font-bold text-[#983e34] hover:underline">
                  1日の目標を設定
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              )}
            </div>
          </section>
        ) : (
          <p className="text-sm text-[#765b50]" role="status">読み込み中…</p>
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
        <span key={weekday} className="py-1 text-center text-xs font-semibold text-[#765b50]">{weekday}</span>
      ))}
      {Array.from({ length: leading }, (_, index) => <span key={index} aria-hidden="true" />)}
      {days.map((day) => {
        const isToday = day.date === today;
        return (
          <button
            key={day.date}
            type="button"
            onClick={() => onSelect(day.date)}
            disabled={day.status === "future"}
            aria-current={isToday ? "date" : undefined}
            aria-haspopup="dialog"
            aria-label={`${formatDateShort(day.date)} ${budgetDayLabel[day.status]}`}
            className={`flex min-h-11 w-full flex-col items-center justify-center rounded-xl border text-xs font-bold tabular-nums sm:min-h-14 sm:text-sm ${
              isToday ? "border-[#b57063] bg-[#f6e2d9] text-[#7f362d]"
                : "border-transparent text-[#523b32] enabled:hover:bg-[#f8ebe1] disabled:text-[#938075]"
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="calendar-day-title" className="m-auto w-[92vw] max-w-sm rounded-2xl border border-[#eadccf] bg-[#fffdf9] p-4 text-[#3b2721] shadow-xl backdrop:bg-[#3b2721]/40 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 id="calendar-day-title" className="text-lg font-bold">{formatDateShort(day.date)}</h2>
        <form method="dialog">
          <button type="submit" className="tap-target grid place-items-center rounded-lg text-[#765b50] hover:bg-[#f7ede4]" aria-label="閉じる">
            <X size={22} aria-hidden="true" />
          </button>
        </form>
      </div>
      <p className="mt-1 flex w-fit items-center gap-1.5 rounded-full bg-[#f7ede4] px-2.5 py-0.5 text-xs font-bold text-[#765b50]">
        <BudgetDayMark status={day.status} />
        {budgetDayLabel[day.status]}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-b border-[#f0e5db] pb-3">
        <div>
          <dt className="text-xs font-semibold text-[#765b50]">支出（固定費を除く）</dt>
          <dd className="mt-1 break-all text-xl font-bold tabular-nums">{formatYen(day.amount)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-[#765b50]">その日の目標</dt>
          <dd className="mt-1 break-all text-xl font-bold tabular-nums">{day.goal === null ? "未設定" : formatYen(day.goal)}</dd>
        </div>
      </dl>
      <Link href={`/history?date=${day.date}`} className="tap-target mt-1 flex w-fit items-center gap-2 rounded-lg text-sm font-bold text-[#983e34] hover:underline">
        この日の履歴を見る
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </dialog>
  );
}
