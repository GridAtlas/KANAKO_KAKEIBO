"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Flower, LockKeyhole, Shirt } from "lucide-react";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { getMiniKanakoStage, type MiniKanakoStage } from "@/lib/dailyBudget";
import { useDailyBudget } from "@/lib/useDailyBudget";
import { useWardrobe } from "@/lib/useWardrobe";
import { getOutfitImage, WARDROBE_OUTFITS, type OutfitId } from "@/lib/wardrobe";

const outfitBackdrops: Record<OutfitId, string> = {
  classic: "from-[#f9e6da] to-[#f2d5c7]",
  blossom: "from-[#f0f3e8] to-[#dce7d6]",
  starlight: "from-[#efebf5] to-[#dfd8ed]",
};

export default function WardrobePage() {
  const { today, goals, spending } = useDailyBudget();
  const { currentStreak, longestStreak, unlockedOutfits, activeOutfit, setActiveOutfit } = useWardrobe(today, goals, spending);
  const stage = today ? getMiniKanakoStage(today, goals, spending) : 0;
  const outfitName = WARDROBE_OUTFITS.find(({ id }) => id === activeOutfit)?.name;

  return (
    <main className="wide-page w-full px-4 pb-8 pt-3 sm:px-6 md:pt-6">
      <BudgetPageHeader />
      <header className="my-5 md:my-7">
        <h1 className="flex items-center gap-2 text-[clamp(1.35rem,4vw,1.9rem)] font-bold leading-tight tracking-tight text-[#3b2721]">
          <Shirt size={24} className="shrink-0 text-[#a13e34]" aria-hidden="true" />
          ミニかなこの着せ替え
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#765b50]">
          はなまるが続くと、新しい衣装が増えます。
        </p>
      </header>
      {today ? (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border border-[#eadccf] bg-[#fffdf9] px-4 py-3 sm:px-5">
            <dl className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs font-semibold text-[#765b50] sm:text-sm">
              <div className="flex items-center gap-1.5">
                <Flower size={17} className="text-[#a13e34]" aria-hidden="true" />
                <dt>連続はなまる</dt>
                <dd className="font-bold tabular-nums text-[#a13e34]">{currentStreak}日</dd>
              </div>
              <div className="flex gap-1.5">
                <dt>最高記録</dt>
                <dd className="font-bold tabular-nums text-[#3b2721]">{longestStreak}日</dd>
              </div>
            </dl>
            <p className="text-xs text-[#765b50]" role="status">
              着用中 <span className="font-bold">{outfitName}</span>
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5" aria-label="衣装">
            {WARDROBE_OUTFITS.map((outfit) => (
              <li key={outfit.id} className="min-w-0">
                <OutfitCard
                  outfit={outfit}
                  stage={stage}
                  unlocked={unlockedOutfits.includes(outfit.id)}
                  wearing={activeOutfit === outfit.id}
                  currentStreak={currentStreak}
                  onSelect={() => setActiveOutfit(outfit.id)}
                />
              </li>
            ))}
          </ul>
          {goals.length === 0 && (
            <Link href="/settings/daily-budget" className="tap-target mt-3 inline-flex items-center gap-1.5 rounded-lg text-sm font-bold text-[#983e34] hover:underline">
              はなまるを集めるための目標を設定
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </>
      ) : (
        <p className="text-sm text-[#765b50]" role="status">読み込み中…</p>
      )}
    </main>
  );
}

function OutfitCard({
  outfit,
  stage,
  unlocked,
  wearing,
  currentStreak,
  onSelect,
}: {
  outfit: (typeof WARDROBE_OUTFITS)[number];
  stage: MiniKanakoStage;
  unlocked: boolean;
  wearing: boolean;
  currentStreak: number;
  onSelect: () => void;
}) {
  return (
    <article className={`h-full overflow-hidden rounded-[20px] border bg-[#fffdf9] ${wearing ? "border-[#c18679]" : "border-[#eadccf]"}`}>
      <div className={`relative flex h-[clamp(8.5rem,34vw,15rem)] items-center justify-center overflow-hidden bg-gradient-to-br ${outfitBackdrops[outfit.id]}`}>
        <div className="absolute aspect-square w-2/3 max-w-[12rem] rounded-full bg-white/45" />
        <div className="relative aspect-square h-[97%] max-w-full">
          <Image
            src={getOutfitImage(outfit.id, stage)}
            fill
            sizes="(max-width: 767px) 45vw, 238px"
            alt={outfit.name}
            className="object-contain drop-shadow-[0_4px_8px_rgba(69,46,33,0.15)]"
          />
        </div>
        {!unlocked && (
          <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-[#fffdf9]/90 text-[#765b50]" aria-label="未解放" role="img">
            <LockKeyhole size={15} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="px-2.5 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
        <h2 className="text-sm font-bold leading-snug text-[#3b2721] sm:text-base">{outfit.name}</h2>
        <p className="mt-1 text-[11px] font-medium text-[#765b50] sm:text-xs">
          {outfit.requiredStreak === 0 ? "最初から着用可能" : `はなまる ${outfit.requiredStreak}日連続で解放`}
        </p>
        {unlocked ? (
          <button
            type="button"
            onClick={onSelect}
            disabled={wearing}
            aria-label={wearing ? `${outfit.name}を着用中` : `${outfit.name}を着る`}
            className="tap-target mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#a13e34] px-2 text-xs font-bold text-white enabled:hover:bg-[#862e28] disabled:bg-[#f4e7dc] disabled:text-[#983e34] sm:text-sm"
          >
            {wearing ? <><Check size={15} aria-hidden="true" /> 着用中</> : "着る"}
          </button>
        ) : (
          <p className="mt-2 flex min-h-11 items-center justify-center rounded-xl bg-[#f7f0e9] px-1.5 text-center text-xs font-bold tabular-nums text-[#765b50] sm:text-sm">
            解放まであと{outfit.requiredStreak - currentStreak}日
          </p>
        )}
      </div>
    </article>
  );
}
