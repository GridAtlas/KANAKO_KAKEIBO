import { getDailyBudgetStatus, type DailyBudgetDay, type DailyBudgetGoal } from "./dailyBudget";
import { dateToLocalString } from "./date";

export interface WeeklyBudget {
  days: DailyBudgetDay[];
  budget: number | null;
  spent: number;
  carriedBalance: number;
  todayBalance: number | null;
}

export function getWeeklyBudget(
  today: string,
  goals: readonly DailyBudgetGoal[],
  spending: ReadonlyMap<string, number>,
): WeeklyBudget {
  const [year, month, date] = today.split("-").map(Number);
  const weekday = new Date(year, month - 1, date, 12).getDay();
  const todayIndex = (weekday + 6) % 7;
  const monday = date - todayIndex;
  const days = Array.from({ length: 7 }, (_, index) => {
    const localDate = dateToLocalString(new Date(year, month - 1, monday + index, 12));
    return getDailyBudgetStatus(localDate, today, goals, spending);
  });
  const todayDay = days[todayIndex];
  if (todayDay.goal === null) {
    return { days, budget: null, spent: 0, carriedBalance: 0, todayBalance: null };
  }

  let budget = 0;
  let spent = 0;
  let carriedBalance = 0;
  for (const day of days) {
    if (day.goal === null) continue;
    budget += day.goal;
    if (day.date <= today) spent += day.amount;
    if (day.date < today) carriedBalance += day.goal - day.amount;
  }

  return {
    days,
    budget,
    spent,
    carriedBalance,
    todayBalance: todayDay.goal + carriedBalance - todayDay.amount,
  };
}
