import {
  getCompletedDailyBudgetOutcomes,
  type DailyBudgetGoal,
  type MiniKanakoStage,
} from "./dailyBudget";
import { dateToLocalString } from "./date";

const velvetOutfit = {
  id: "velvet", name: "ベルベットの夜会服", requiredStreak: 21, imagePrefix: "mini-kanako-velvet",
} as const;

export const WARDROBE_OUTFITS = [
  { id: "classic", name: "いつものエプロン", requiredStreak: 0, imagePrefix: "mini-kanako" },
  { id: "blossom", name: "桜のおでかけ服", requiredStreak: 3, imagePrefix: "mini-kanako-blossom-v2" },
  { id: "starlight", name: "星空のドレス", requiredStreak: 7, imagePrefix: "mini-kanako-starlight-v2" },
  { id: "linen", name: "リネンの街歩き", requiredStreak: 10, imagePrefix: "mini-kanako-linen" },
  { id: "jardin", name: "庭園のティードレス", requiredStreak: 14, imagePrefix: "mini-kanako-jardin" },
  velvetOutfit,
  { id: "tailored", name: "テーラードコート", requiredHanamaru: 7, imagePrefix: "mini-kanako-tailored" },
  { id: "silk", name: "シルクのドレス", requiredHanamaru: 14, imagePrefix: "mini-kanako-silk" },
  { id: "pearl", name: "パールの装い", requiredHanamaru: 21, imagePrefix: "mini-kanako-pearl" },
  { id: "atelier", name: "メゾン・カナコのジャケット", requiredHanamaru: 30, imagePrefix: "mini-kanako-atelier" },
  { id: "couture", name: "メゾン・カナコの刺繍ドレス", requiredHanamaru: 45, imagePrefix: "mini-kanako-couture" },
  { id: "signature", name: "メゾン・カナコのサファイアドレス", requiredHanamaru: 60, imagePrefix: "mini-kanako-signature" },
] as const;

export type OutfitId = (typeof WARDROBE_OUTFITS)[number]["id"];
export const DEFAULT_OUTFIT = WARDROBE_OUTFITS[0].id;
export const OUTFITS_PER_GROUP = 3;

interface WardrobeProgress {
  currentStreak: number;
  longestStreak: number;
  earnedHanamaru: number;
  velvetEarnedDate: string | undefined;
}

export function getWardrobeProgress(
  today: string | undefined,
  goals: readonly DailyBudgetGoal[],
  spending: ReadonlyMap<string, number>,
  previouslyUnlocked: readonly OutfitId[],
  savedVelvetEarnedDate?: string,
): WardrobeProgress {
  let currentStreak = 0;
  let longestStreak = 0;
  let earnedHanamaru = 0;
  let velvetEarnedDate = savedVelvetEarnedDate;
  if (!today) return { currentStreak, longestStreak, earnedHanamaru, velvetEarnedDate };

  for (const { date, outcome } of getCompletedDailyBudgetOutcomes(today, goals, spending)) {
    if (outcome === "over") {
      currentStreak = 0;
      continue;
    }

    currentStreak++;
    longestStreak = Math.max(longestStreak, currentStreak);
    if (velvetEarnedDate && date > velvetEarnedDate) earnedHanamaru++;
    if (!velvetEarnedDate && currentStreak === velvetOutfit.requiredStreak) velvetEarnedDate = date;
  }

  if (!velvetEarnedDate && previouslyUnlocked.includes(velvetOutfit.id)) {
    // 旧版の解放済みデータで解放日を復元できない場合は、今日の達成から数える。
    const [year, month, day] = today.split("-").map(Number);
    velvetEarnedDate = dateToLocalString(new Date(year, month - 1, day - 1, 12));
  }

  return { currentStreak, longestStreak, earnedHanamaru, velvetEarnedDate };
}

export function getUnlockedOutfits(
  { longestStreak, earnedHanamaru }: WardrobeProgress,
  previouslyUnlocked: readonly OutfitId[],
): OutfitId[] {
  return WARDROBE_OUTFITS
    .filter((outfit) => previouslyUnlocked.includes(outfit.id) || (
      "requiredStreak" in outfit
        ? longestStreak >= outfit.requiredStreak
        : earnedHanamaru >= outfit.requiredHanamaru
    ))
    .map(({ id }) => id);
}

export function getVisibleOutfits(unlockedOutfits: readonly OutfitId[]) {
  const firstLockedIndex = WARDROBE_OUTFITS.findIndex(({ id }) => !unlockedOutfits.includes(id));
  const visibleCount = firstLockedIndex === -1
    ? WARDROBE_OUTFITS.length
    : (Math.floor(firstLockedIndex / OUTFITS_PER_GROUP) + 1) * OUTFITS_PER_GROUP;
  return WARDROBE_OUTFITS.slice(0, visibleCount);
}

export function getOutfitImage(outfit: OutfitId, stage: MiniKanakoStage): string {
  const basePath = process.env.NEXT_PUBLIC_KANAKO_BASE_PATH ?? "";
  const preview = WARDROBE_OUTFITS.find(({ id }) => id === outfit) ?? WARDROBE_OUTFITS[0];
  return `${basePath}/images/${preview.imagePrefix}-${stage + 2}.webp`;
}
