"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Flower, LockKeyhole, Shirt } from "lucide-react";
import { useRef, useState } from "react";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { getMiniKanakoStage } from "@/lib/dailyBudget";
import { useDailyBudget } from "@/lib/useDailyBudget";
import { useWardrobe } from "@/lib/useWardrobe";
import { getOutfitImage, WARDROBE_OUTFITS, type OutfitId } from "@/lib/wardrobe";

const outfitPreviews: Record<OutfitId, { label: string; backdrop: string }> = {
  classic: { label: "エプロン", backdrop: "from-[#f9e6da] to-[#f2d5c7]" },
  blossom: { label: "桜", backdrop: "from-[#f0f3e8] to-[#dce7d6]" },
  starlight: { label: "星空", backdrop: "from-[#efebf5] to-[#dfd8ed]" },
};

export default function WardrobePage() {
  const { today, goals, spending } = useDailyBudget();
  const { currentStreak, longestStreak, unlockedOutfits, activeOutfit, setActiveOutfit } = useWardrobe(today, goals, spending);
  const [previewOutfit, setPreviewOutfit] = useState<OutfitId>();
  const selectedPreviewButton = useRef<HTMLButtonElement>(null);
  const selectedOutfit = previewOutfit ?? activeOutfit;
  const outfit = WARDROBE_OUTFITS.find(({ id }) => id === selectedOutfit) ?? WARDROBE_OUTFITS[0];
  const unlocked = unlockedOutfits.includes(outfit.id);
  const wearing = outfit.id === activeOutfit;
  const stage = today ? getMiniKanakoStage(today, goals, spending) : 0;

  return (
    <main className="wide-page compact-page w-full px-3 pb-3 pt-2 sm:px-6 md:pt-5">
      <BudgetPageHeader />
      <section className="mx-auto mt-2 max-w-lg sm:mt-4">
        <header className="mb-2 flex min-h-7 flex-wrap items-center justify-between gap-x-2 gap-y-1 sm:mb-3">
          <h1 className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-[#3b2721] sm:text-2xl">
            <Shirt size={20} className="shrink-0 text-[#a13e34]" aria-hidden="true" />
            着せ替え
          </h1>
          {today && (
            <dl aria-label="はなまるの連続記録" className="flex items-center gap-2 text-xs font-semibold tabular-nums text-[#765b50] sm:gap-3 sm:text-sm">
              <div className="flex items-center gap-1">
                <Flower size={14} className="text-[#a13e34]" aria-hidden="true" />
                <dt>連続</dt>
                <dd className="font-bold text-[#a13e34]">{currentStreak}日</dd>
              </div>
              <div className="flex items-center gap-1">
                <dt>最高</dt>
                <dd className="font-bold text-[#3b2721]">{longestStreak}日</dd>
              </div>
            </dl>
          )}
        </header>

        {today ? (
          <>
            <figure className="overflow-hidden rounded-[20px] border border-[#eadccf] bg-[#fffdf9]">
              <div className={`relative flex h-[clamp(8rem,37dvh,17rem)] items-center justify-center overflow-hidden bg-gradient-to-br sm:h-[clamp(11rem,44dvh,22rem)] ${outfitPreviews[outfit.id].backdrop}`}>
                <div className="absolute aspect-square h-[76%] rounded-full bg-white/45" aria-hidden="true" />
                <div className="relative aspect-square h-full max-w-full">
                  <Image
                    key={outfit.id}
                    src={getOutfitImage(outfit.id, stage)}
                    fill
                    priority
                    sizes="(max-width: 639px) 75vw, 352px"
                    alt={`${outfit.name}を着たミニかなこ`}
                    className="object-contain drop-shadow-[0_4px_8px_rgba(69,46,33,0.15)]"
                  />
                </div>
              </div>
              <figcaption className="flex min-h-10 flex-wrap items-center justify-between gap-x-2 px-3 py-1.5" aria-live="polite">
                <span className="text-sm font-bold text-[#3b2721] sm:text-base">{outfit.name}</span>
                {!unlocked && (
                  <span className="text-xs font-semibold text-[#765b50]">はなまる{outfit.requiredStreak}日連続で解放</span>
                )}
              </figcaption>
            </figure>

            <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2" role="group" aria-label="衣装のプレビュー">
              {WARDROBE_OUTFITS.map(({ id, name }) => {
                const isWearing = id === activeOutfit;
                const isLocked = !unlockedOutfits.includes(id);
                const selected = id === selectedOutfit;

                return (
                  <button
                    key={id}
                    ref={selected ? selectedPreviewButton : undefined}
                    type="button"
                    aria-label={isWearing ? `${name}、着用中` : isLocked ? `${name}、未解放` : name}
                    aria-pressed={selected}
                    onClick={() => setPreviewOutfit(id)}
                    className={`tap-target flex min-w-0 items-center justify-center gap-1 rounded-xl border px-1 text-xs font-bold sm:text-sm ${selected ? "border-[#a13e34] bg-[#f7e7df] text-[#862e28]" : "border-[#eadccf] bg-[#fffdf9] text-[#765b50] hover:bg-[#faf2ea]"}`}
                  >
                    {isWearing && <Check size={14} className="shrink-0" aria-hidden="true" />}
                    {isLocked && <LockKeyhole size={13} className="shrink-0" aria-hidden="true" />}
                    {outfitPreviews[id].label}
                  </button>
                );
              })}
            </div>

            <div className="mt-2">
              {unlocked && !wearing ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveOutfit(outfit.id);
                    selectedPreviewButton.current?.focus();
                  }}
                  className="tap-target flex w-full items-center justify-center rounded-xl bg-[#a13e34] px-3 text-sm font-bold text-white hover:bg-[#862e28]"
                >
                  この衣装を着る
                </button>
              ) : goals.length === 0 ? (
                <Link href="/settings/daily-budget" className="tap-target flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#eadccf] bg-[#fffdf9] px-3 text-sm font-bold text-[#983e34] hover:bg-[#faf2ea]">
                  目標を設定する
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ) : (
                <p role="status" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#f4e7dc] px-2 text-sm font-bold tabular-nums text-[#765b50]">
                  {wearing ? <><Check size={16} aria-hidden="true" />着用中</> : `解放まであと${outfit.requiredStreak - currentStreak}日`}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-[#765b50]" role="status">読み込み中…</p>
        )}
      </section>
    </main>
  );
}
