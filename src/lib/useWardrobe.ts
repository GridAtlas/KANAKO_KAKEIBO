"use client";

import { useEffect, useMemo } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import type { DailyBudgetGoal } from "./dailyBudget";
import { getWardrobeProgress, getUnlockedOutfits, WARDROBE_OUTFITS, type OutfitId } from "./wardrobe";

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
  const velvetEarnedDate = useBudgetStore((state) => state.velvetEarnedDate);
  const updateWardrobe = useBudgetStore((state) => state.updateWardrobe);
  const isDebugMode = debugOutfit !== null;
  const progress = useMemo(
    () => getWardrobeProgress(today, goals, spending, previouslyUnlocked, velvetEarnedDate),
    [today, goals, spending, previouslyUnlocked, velvetEarnedDate],
  );
  const unlockedOutfits = useMemo(
    () => getUnlockedOutfits(progress, previouslyUnlocked),
    [progress, previouslyUnlocked],
  );
  const shouldSaveProgress = progress.velvetEarnedDate !== velvetEarnedDate
    || unlockedOutfits.length !== previouslyUnlocked.length;

  useEffect(() => {
    if (today && shouldSaveProgress) updateWardrobe(today);
  }, [today, shouldSaveProgress, updateWardrobe]);

  function setActiveOutfit(outfit: OutfitId) {
    if (isDebugMode) {
      setDebugOutfit(outfit);
      return;
    }
    if (today) updateWardrobe(today, outfit);
  }

  return {
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    earnedHanamaru: progress.earnedHanamaru,
    unlockedOutfits: isDebugMode ? allOutfitIds : unlockedOutfits,
    activeOutfit: debugOutfit ?? activeOutfit,
    setActiveOutfit,
    isDebugMode,
    exitDebugMode: () => setDebugOutfit(null),
  };
}
