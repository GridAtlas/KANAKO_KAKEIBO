"use client";

import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { WeeklyBudgetCard } from "@/components/WeeklyBudgetCard";
import { useDailyBudget } from "@/lib/useDailyBudget";
import { getWeeklyBudget } from "@/lib/weeklyBudget";

export default function WeeklyPage() {
  const { today, goals, spending } = useDailyBudget();

  return (
    <main className="wide-page compact-page w-full px-3 pb-2 pt-2 sm:px-6 md:pt-4">
      <BudgetPageHeader />
      <div className="mx-auto mt-3 max-w-xl md:mt-5">
        {today ? (
          <WeeklyBudgetCard week={getWeeklyBudget(today, goals, spending)} />
        ) : (
          <p role="status" className="text-sm text-[#765b50]">読み込み中…</p>
        )}
      </div>
    </main>
  );
}
