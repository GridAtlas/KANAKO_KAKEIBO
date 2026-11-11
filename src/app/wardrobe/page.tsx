"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Flower, Flower2, LockKeyhole, Shirt, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { getMiniKanakoStage } from "@/lib/dailyBudget";
import { useDailyBudget } from "@/lib/useDailyBudget";
import { useWardrobe } from "@/lib/useWardrobe";
import { getOutfitImage, WARDROBE_OUTFITS, type OutfitId } from "@/lib/wardrobe";

const outfitPreviews = {
  classic: {
    label: "エプロン",
    backdrop: "from-[#fff2e8] via-[#f8e0e5] to-[#edbfcb]",
    motif: Flower,
    motifColor: "text-[#a53c55]/40",
    selected: "border-[#a53c55] bg-[#f7dce4] text-[#893047]",
  },
  blossom: {
    label: "桜",
    backdrop: "from-[#fff5e9] via-[#f9e5e7] to-[#d1e0ce]",
    motif: Flower2,
    motifColor: "text-[#53705c]/45",
    selected: "border-[#53705c] bg-[#e6efe5] text-[#415a49]",
  },
  starlight: {
    label: "星空",
    backdrop: "from-[#fcf1ec] via-[#eee3f2] to-[#d5cce8]",
    motif: Sparkles,
    motifColor: "text-[#82608e]/55",
    selected: "border-[#82608e] bg-[#eee5f3] text-[#62426e]",
  },
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
  const { backdrop, motif: Motif, motifColor } = outfitPreviews[outfit.id];

  return (
    <main className="wide-page compact-page w-full px-3 pb-3 pt-2 sm:px-6 md:pt-5">
      <BudgetPageHeader />
      <section className="mx-auto mt-2 max-w-lg sm:mt-4">
        <header className="mb-2 flex min-h-7 flex-wrap items-center justify-between gap-x-2 gap-y-1 sm:mb-3">
          <h1 className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-[#40262d] sm:text-2xl">
            <Shirt size={19} strokeWidth={1.75} className="shrink-0 text-[#a53c55]" aria-hidden="true" />
            着せ替え
          </h1>
          {today && (
            <dl aria-label="はなまるの連続記録" className="flex items-center gap-2 text-xs font-semibold tabular-nums text-[#755d62] sm:gap-3 sm:text-sm">
              <div className="flex items-center gap-1">
                <Flower size={14} className="text-[#a53c55]" aria-hidden="true" />
                <dt>連続</dt>
                <dd className="font-bold text-[#a53c55]">{currentStreak}日</dd>
              </div>
              <div className="flex items-center gap-1">
                <dt>最高</dt>
                <dd className="font-bold text-[#40262d]">{longestStreak}日</dd>
              </div>
            </dl>
          )}
        </header>

        {today ? (
          <>
            <figure className="overflow-hidden rounded-[20px] border border-[#ecd9dd] bg-[#fffcf8] shadow-[0_5px_18px_rgba(132,66,82,0.09)]">
              <div className={`relative isolate flex h-[clamp(8rem,37dvh,17rem)] items-center justify-center overflow-hidden bg-gradient-to-br sm:h-[clamp(11rem,44dvh,22rem)] ${backdrop}`}>
                <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[15px] border border-[#a37338]/35">
                  <Motif size={27} strokeWidth={1.2} className={`absolute bottom-[12%] left-[6%] ${motifColor}`} />
                  <Motif size={19} strokeWidth={1.2} className={`absolute right-[8%] top-[12%] ${motifColor}`} />
                </div>
                <div className="absolute aspect-square h-[77%] rounded-full bg-[#fffaf5]/55" aria-hidden="true" />
                <div className="relative aspect-square h-full max-w-full">
                  <Image
                    key={outfit.id}
                    src={getOutfitImage(outfit.id, stage)}
                    fill
                    priority
                    sizes="(max-width: 639px) 75vw, 352px"
                    alt={`${outfit.name}を着たミニかなこ`}
                    className="object-contain drop-shadow-[0_5px_9px_rgba(85,49,66,0.15)]"
                  />
                </div>
              </div>
              <figcaption className="flex min-h-10 flex-wrap items-center justify-between gap-x-2 px-3 py-1.5" aria-live="polite">
                <span className="text-sm font-bold text-[#40262d] sm:text-base">{outfit.name}</span>
                {!unlocked && (
                  <span className="text-xs font-semibold text-[#755d62]">はなまる{outfit.requiredStreak}日連続で解放</span>
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
                    className={`tap-target flex min-w-0 items-center justify-center gap-1 rounded-xl border px-1 text-xs font-bold sm:text-sm ${selected ? outfitPreviews[id].selected : "border-[#ecd9dd] bg-[#fffcf8] text-[#755d62] hover:bg-[#fbebef]"}`}
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
                  className="tap-target flex w-full items-center justify-center rounded-xl bg-[#a53c55] px-3 text-sm font-bold text-white shadow-[0_3px_10px_rgba(165,60,85,0.16)] hover:bg-[#893047]"
                >
                  この衣装を着る
                </button>
              ) : goals.length === 0 ? (
                <Link href="/settings/daily-budget" className="tap-target flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#ecd9dd] bg-[#fffcf8] px-3 text-sm font-bold text-[#a53c55] hover:bg-[#fbebef]">
                  目標を設定する
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              ) : (
                <p role="status" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#f5e8eb] px-2 text-sm font-bold tabular-nums text-[#755d62]">
                  {wearing ? <><Check size={16} aria-hidden="true" />着用中</> : `解放まであと${outfit.requiredStreak - currentStreak}日`}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-[#755d62]" role="status">読み込み中…</p>
        )}
      </section>
    </main>
  );
}
