import {
  getCompletedDailyBudgetOutcomes,
  type DailyBudgetGoal,
  type MiniKanakoStage,
} from "./dailyBudget";

export const WARDROBE_OUTFITS = [
  { id: "classic", name: "いつものエプロン", requiredStreak: 0 },
  { id: "blossom", name: "桜のおでかけ服", requiredStreak: 3 },
  { id: "starlight", name: "星空のドレス", requiredStreak: 7 },
] as const;

export type OutfitId = (typeof WARDROBE_OUTFITS)[number]["id"];
export const DEFAULT_OUTFIT = WARDROBE_OUTFITS[0].id;

export function getHanamaruStreaks(
  today: string,
  goals: readonly DailyBudgetGoal[],
  spending: ReadonlyMap<string, number>,
): { current: number; longest: number } {
  let current = 0;
  let longest = 0;

  for (const outcome of getCompletedDailyBudgetOutcomes(today, goals, spending)) {
    current = outcome === "achieved" ? current + 1 : 0;
    longest = Math.max(longest, current);
  }

  return { current, longest };
}

export function getUnlockedOutfits(
  longestStreak: number,
  previouslyUnlocked: readonly OutfitId[],
): OutfitId[] {
  return WARDROBE_OUTFITS
    .filter(({ id, requiredStreak }) => previouslyUnlocked.includes(id) || longestStreak >= requiredStreak)
    .map(({ id }) => id);
}

export function getOutfitImage(outfit: OutfitId, stage: MiniKanakoStage): string {
  const basePath = process.env.NEXT_PUBLIC_KANAKO_BASE_PATH ?? "";
  const outfitPart = outfit === DEFAULT_OUTFIT ? "" : `${outfit}-`;
  return `${basePath}/images/mini-kanako-${outfitPart}${stage + 2}.webp`;
}
