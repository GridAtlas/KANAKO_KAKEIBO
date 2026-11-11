"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Flower } from "lucide-react";
import { BudgetDayMark, budgetDayLabel } from "@/components/BudgetDayMark";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { getDailyBudgetMonth, type DailyBudgetDay } from "@/lib/dailyBudget";
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

  function changeMonth(nextMonth?: string) {
    setChosenMonth(nextMonth === currentMonth ? undefined : nextMonth);
    setChosenDate(undefined);
  }

  const days = today && month ? getDailyBudgetMonth(month, today, goals, spending) : [];
  const selectedDate = chosenDate ?? (month === currentMonth ? today : days[0]?.date);
  const selected = days.find((day) => day.date === selectedDate);
  const achieved = days.filter((day) => day.status === "achieved").length;

  return (
    <main className="wide-page w-full px-4 pb-8 pt-3 sm:px-6 md:pt-6">
      <BudgetPageHeader />
      <div className="mb-4 mt-5 flex flex-wrap items-end justify-between gap-2 md:mb-5 md:mt-7">
        <h1 className="flex items-center gap-2 text-[clamp(1.35rem,4vw,1.9rem)] font-bold leading-tight tracking-tight text-[#3b2721]">
          <CalendarDays size={24} className="shrink-0 text-[#a13e34]" aria-hidden="true" />
          はなまるカレンダー
        </h1>
        {month && (
          <p className="inline-flex items-center gap-1.5 rounded-full bg-[#f5e2d8] px-3 py-1.5 text-xs font-bold text-[#983e34] sm:text-sm">
            <Flower size={16} aria-hidden="true" />
            はなまる <span className="tabular-nums">{achieved}日</span>
          </p>
        )}
      </div>
      {today && month && selected ? (
        <div className="grid items-start gap-4 md:grid-cols-[1.55fr_1fr] md:gap-5">
          <section aria-label="月間カレンダー" className="min-w-0 rounded-[24px] border border-[#eadccf] bg-[#fffdf9] px-3 pb-4 pt-2 shadow-[0_8px_24px_rgba(94,58,33,0.045)] max-[368px]:-mx-4 max-[368px]:rounded-none max-[368px]:border-x-0 max-[368px]:px-1 sm:px-5 sm:pb-5">
            <div className="mb-1 flex items-center justify-between gap-1">
              <button type="button" onClick={() => changeMonth(shiftMonthKey(month, -1))} aria-label="前の月" className="tap-target grid place-items-center rounded-xl text-[#983e34] hover:bg-[#f8ebe1]">
                <ChevronLeft size={21} aria-hidden="true" />
              </button>
              <h2 className="text-base font-bold text-[#3b2721] sm:text-lg" aria-live="polite">{formatMonthLabel(month)}</h2>
              <button type="button" onClick={() => changeMonth(shiftMonthKey(month, 1))} disabled={month === currentMonth} aria-label="次の月" className="tap-target grid place-items-center rounded-xl text-[#983e34] enabled:hover:bg-[#f8ebe1] disabled:text-[#bda99b]">
                <ChevronRight size={21} aria-hidden="true" />
              </button>
            </div>
            <CalendarGrid days={days} month={month} today={today} selectedDate={selected.date} onSelect={setChosenDate} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 border-t border-[#f0e5db] pt-2">
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-[11px] font-semibold text-[#765b50] sm:text-xs" aria-label="カレンダーの凡例">
                {legendStatuses.map((status) => (
                  <li key={status} className="flex items-center gap-1">
                    <span className="grid h-6 w-6 place-items-center"><BudgetDayMark status={status} /></span>
                    {budgetDayLabel[status]}
                  </li>
                ))}
              </ul>
              {month !== currentMonth && (
                <button type="button" onClick={() => changeMonth()} className="tap-target rounded-lg px-2 text-xs font-bold text-[#983e34] hover:bg-[#f8ebe1]">
                  今月に戻る
                </button>
              )}
            </div>
          </section>
          <DayDetails day={selected} hasGoals={goals.length > 0} />
        </div>
      ) : (
        <p className="text-sm text-[#765b50]" role="status">読み込み中…</p>
      )}
    </main>
  );
}

function CalendarGrid({
  days,
  month,
  today,
  selectedDate,
  onSelect,
}: {
  days: DailyBudgetDay[];
  month: string;
  today: string;
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  const { year, month: monthNumber } = parseMonthKey(month);
  const leading = (new Date(year, monthNumber - 1, 1).getDay() + 6) % 7;
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[308px] grid-cols-7">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="py-2 text-center text-xs font-semibold text-[#765b50]">{weekday}</span>
        ))}
        {Array.from({ length: leading }, (_, index) => <span key={index} aria-hidden="true" />)}
        {days.map((day) => {
          const isToday = day.date === today;
          const isSelected = day.date === selectedDate;
          const text = Number(day.date.slice(-2));
          return (
            <div key={day.date} className="py-[1px] sm:p-0.5">
              <button
                type="button"
                onClick={() => onSelect(day.date)}
                disabled={day.status === "future"}
                aria-current={isToday ? "date" : undefined}
                aria-pressed={isSelected}
                aria-label={`${formatDateShort(day.date)} ${budgetDayLabel[day.status]}`}
                className={`flex min-h-11 w-full flex-col items-center justify-center gap-0.5 rounded-xl border text-xs font-bold tabular-nums sm:min-h-14 sm:text-sm ${
                  isSelected ? "border-[#b57063] bg-[#f6e2d9] text-[#7f362d]"
                    : `${isToday ? "border-[#b57063]" : "border-transparent"} bg-[#fbf4ee] text-[#523b32] enabled:hover:border-[#d9ad9d] enabled:hover:bg-[#f8ebe1] disabled:bg-transparent disabled:text-[#938075]`
                }`}
              >
                {text}
                <span className="grid h-5 place-items-center"><BudgetDayMark status={day.status} /></span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayDetails({ day, hasGoals }: { day: DailyBudgetDay; hasGoals: boolean }) {
  return (
    <section className="rounded-[24px] border border-[#eadccf] bg-[#fffdf9] p-5 sm:p-6" aria-label="選択した日の支出">
      <div aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-[#3b2721]">{formatDateShort(day.date)}</h2>
          <span className="flex items-center gap-1 rounded-full bg-[#f7ede4] px-2.5 py-1 text-xs font-bold text-[#765b50]">
            <BudgetDayMark status={day.status} />
            {budgetDayLabel[day.status]}
          </span>
        </div>
        <dl className="mt-4 flex flex-wrap justify-between gap-3 border-b border-[#f0e5db] pb-4">
          <div>
            <dt className="text-xs font-semibold text-[#765b50]">支出（固定費を除く）</dt>
            <dd className="mt-1 break-all text-2xl font-bold tabular-nums text-[#3b2721]">{formatYen(day.amount)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-[#765b50]">その日の目標</dt>
            <dd className="mt-1 break-all text-2xl font-bold tabular-nums text-[#3b2721]">{day.goal === null ? "—" : formatYen(day.goal)}</dd>
          </div>
        </dl>
      </div>
      <Link href={`/history?date=${day.date}`} className="tap-target mt-1 flex w-fit items-center gap-2 rounded-lg text-sm font-bold text-[#983e34] hover:underline">
        この日の履歴を見る
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
      <p className="mt-2 text-xs leading-relaxed text-[#765b50]">
        支出が目標以内だった日には、翌日にはなまるがつきます。
      </p>
      {!hasGoals && (
        <Link href="/settings/daily-budget" className="tap-target mt-1 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#983e34] hover:underline">
          1日の目標を設定
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}
