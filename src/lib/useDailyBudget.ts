"use client";

import { useEffect, useMemo, useState } from "react";
import { getDailySpending } from "@/lib/dailyBudget";
import { todayLocal } from "@/lib/date";
import { useBudgetStore } from "@/store/useBudgetStore";

export function useDailyBudget() {
  const goals = useBudgetStore((state) => state.dailyBudgetGoals);
  const transactions = useBudgetStore((state) => state.transactions);
  const categories = useBudgetStore((state) => state.categories);
  const spending = useMemo(
    () => getDailySpending(transactions, categories),
    [transactions, categories],
  );
  const [today, setToday] = useState<string>();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const refresh = () => {
      clearTimeout(timer);
      setToday(todayLocal());
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, midnight.getTime() - now.getTime());
    };

    refresh();
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return { today, goals, spending };
}
