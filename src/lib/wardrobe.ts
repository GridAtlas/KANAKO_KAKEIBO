import {
  getCompletedDailyBudgetOutcomes,
  type DailyBudgetGoal,
  type MiniKanakoStage,
} from "./dailyBudget";

export const WARDROBE_OUTFITS = [
  { id: "classic", name: "いつものエプロン", requiredStreak: 0, imagePrefix: "mini-kanako" },
  { id: "blossom", name: "桜のおでかけ服", requiredStreak: 3, imagePrefix: "mini-kanako-blossom-v2" },
  { id: "starlight", name: "星空のドレス", requiredStreak: 7, imagePrefix: "mini-kanako-starlight-v2" },
  { id: "linen", name: "リネンの街歩き", requiredStreak: 10, imagePrefix: "mini-kanako-linen" },
  { id: "jardin", name: "庭園のティードレス", requiredStreak: 14, imagePrefix: "mini-kanako-jardin" },
  { id: "velvet", name: "ベルベットの夜会服", requiredStreak: 21, imagePrefix: "mini-kanako-velvet" },
] as const;

export type OutfitId = (typeof WARDROBE_OUTFITS)[number]["id"];
export const DEFAULT_OUTFIT = WARDROBE_OUTFITS[0].id;
const outfitsPerGroup = 3;

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

export function getVisibleOutfits(unlockedOutfits: readonly OutfitId[]) {
  const firstLockedIndex = WARDROBE_OUTFITS.findIndex(({ id }) => !unlockedOutfits.includes(id));
  const visibleCount = firstLockedIndex === -1
    ? WARDROBE_OUTFITS.length
    : (Math.floor(firstLockedIndex / outfitsPerGroup) + 1) * outfitsPerGroup;
  return WARDROBE_OUTFITS.slice(0, visibleCount);
}

export function getOutfitImage(outfit: OutfitId, stage: MiniKanakoStage): string {
  const basePath = process.env.NEXT_PUBLIC_KANAKO_BASE_PATH ?? "";
  const preview = WARDROBE_OUTFITS.find(({ id }) => id === outfit) ?? WARDROBE_OUTFITS[0];
  return `${basePath}/images/${preview.imagePrefix}-${stage + 2}.webp`;
}
