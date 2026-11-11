"use client";

import { useEffect, useMemo } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import type { DailyBudgetGoal } from "./dailyBudget";
import { getHanamaruStreaks, getUnlockedOutfits, WARDROBE_OUTFITS, type OutfitId } from "./wardrobe";

const allOutfitIds = WARDROBE_OUTFITS.map(({ id }) => id);

export function useWardrobe(
  today: string | undefined,
  goals: readonly DailyBudgetGoal[],
  spending: ReadonlyMap<string, number>,
) {
  const activeOutfit = useBudgetStore((state) => state.activeOutfit);
  const debugOutfit = useBudgetStore((state) => state.debugOutfit);
  const setDebugOutfit = useBudgetStore((state) => state.setDebugOutfit);
  const previouslyUnlocked = useBudgetStore((state) => state.unlockedOutfits);
  const updateWardrobe = useBudgetStore((state) => state.updateWardrobe);
  const isDebugMode = debugOutfit !== null;
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
    if (isDebugMode) {
      setDebugOutfit(outfit);
      return;
    }
    updateWardrobe(longestStreak, outfit);
  }

  return {
    currentStreak,
    longestStreak,
    unlockedOutfits: isDebugMode ? allOutfitIds : unlockedOutfits,
    activeOutfit: debugOutfit ?? activeOutfit,
    setActiveOutfit,
    isDebugMode,
    exitDebugMode: () => setDebugOutfit(null),
  };
}
