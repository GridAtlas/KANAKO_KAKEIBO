"use client";

import { useEffect, useMemo } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import type { DailyBudgetGoal } from "./dailyBudget";
import { getHanamaruStreaks, getUnlockedOutfits, type OutfitId } from "./wardrobe";

export function useWardrobe(
  today: string | undefined,
  goals: readonly DailyBudgetGoal[],
  spending: ReadonlyMap<string, number>,
) {
  const activeOutfit = useBudgetStore((state) => state.activeOutfit);
  const previouslyUnlocked = useBudgetStore((state) => state.unlockedOutfits);
  const updateWardrobe = useBudgetStore((state) => state.updateWardrobe);
  const { current: currentStreak, longest: longestStreak } = useMemo(
    () => today ? getHanamaruStreaks(today, goals, spending) : { current: 0, longest: 0 },
    [today, goals, spending],
  );
  const unlockedOutfits = useMemo(
    () => getUnlockedOutfits(longestStreak, previouslyUnlocked),
    [longestStreak, previouslyUnlocked],
  );

  useEffect(() => {
    if (today) updateWardrobe(longestStreak);
  }, [today, longestStreak, updateWardrobe]);

  function setActiveOutfit(outfit: OutfitId) {
    updateWardrobe(longestStreak, outfit);
  }

  return { currentStreak, longestStreak, unlockedOutfits, activeOutfit, setActiveOutfit };
}
