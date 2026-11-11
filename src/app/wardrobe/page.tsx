"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Flower, Flower2, Leaf, LockKeyhole, MoonStar, Shirt, Sparkles, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { getMiniKanakoStage } from "@/lib/dailyBudget";
import { useDailyBudget } from "@/lib/useDailyBudget";
import { useWardrobe } from "@/lib/useWardrobe";
import { getOutfitImage, getVisibleOutfits, type OutfitId } from "@/lib/wardrobe";

const outfitPreviews: Record<OutfitId, {
  label: string;
  backdrop: string;
  motif: LucideIcon;
  motifColor: string;
  selected: string;
}> = {
  classic: {
    label: "エプロン",
    backdrop: "from-[#fff2e8] via-[#f8e0e5] to-[#edbfcb]",
    motif: Flower,
    motifColor: "text-[#a53c55]/40",
    selected: "border-[#a53c55] bg-[#f7dce4] text-[#893047]",
  },
  blossom: {
    label: "桜",
    backdrop: "from-[#fff4ed] via-[#fae8e7] to-[#efd2d9]",
    motif: Flower2,
    motifColor: "text-[#a25e71]/45",
    selected: "border-[#aa6578] bg-[#f7e4e8] text-[#814757]",
  },
  starlight: {
    label: "星空",
    backdrop: "from-[#f6f3f6] via-[#e8eaf2] to-[#d5dbea]",
    motif: MoonStar,
    motifColor: "text-[#465979]/45",
    selected: "border-[#66799b] bg-[#e6eaf3] text-[#405272]",
  },
  linen: {
    label: "リネン",
    backdrop: "from-[#fcf5e8] via-[#f2ebdb] to-[#e1e4cd]",
    motif: BookOpen,
    motifColor: "text-[#7d744a]/45",
    selected: "border-[#8f875b] bg-[#f2eddb] text-[#675f3b]",
  },
  jardin: {
    label: "庭園",
    backdrop: "from-[#fbf7e9] via-[#eaf1e2] to-[#d3e6d7]",
    motif: Leaf,
    motifColor: "text-[#53705c]/45",
    selected: "border-[#698471] bg-[#e5f0e6] text-[#425d4c]",
  },
  velvet: {
    label: "ベルベット",
    backdrop: "from-[#fcf1ec] via-[#f1e2e9] to-[#e4cedb]",
    motif: Sparkles,
    motifColor: "text-[#8b526b]/45",
    selected: "border-[#9c6279] bg-[#f2e4eb] text-[#743d57]",
  },
};

export default function WardrobePage() {
  const { today, goals, spending } = useDailyBudget();
  const { currentStreak, longestStreak, unlockedOutfits, activeOutfit, setActiveOutfit } = useWardrobe(today, goals, spending);
  const [previewOutfit, setPreviewOutfit] = useState<OutfitId>();
  const selectedPreviewButton = useRef<HTMLButtonElement>(null);
  const visibleOutfits = getVisibleOutfits(unlockedOutfits);
  const selectedIndex = Math.max(0, visibleOutfits.findIndex(({ id }) => id === (previewOutfit ?? activeOutfit)));
  const outfit = visibleOutfits[selectedIndex];
  const unlocked = unlockedOutfits.includes(outfit.id);
  const wearing = outfit.id === activeOutfit;
  const stage = today ? getMiniKanakoStage(today, goals, spending) : 0;
  const { backdrop, motif: Motif, motifColor } = outfitPreviews[outfit.id];
  const image = getOutfitImage(outfit.id, stage);
  const silhouette = `url("${image}") center / contain no-repeat`;

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
            <figure className={`overflow-hidden rounded-[20px] border shadow-[0_5px_18px_rgba(132,66,82,0.09)] ${unlocked ? "border-[var(--line)] bg-[var(--surface)]" : "border-[#d7d7dd] bg-[#f6f6f7]"}`}>
              <div className={`relative isolate flex h-[clamp(8rem,32dvh,17rem)] items-center justify-center overflow-hidden bg-gradient-to-br sm:h-[clamp(11rem,44dvh,22rem)] ${unlocked ? backdrop : "from-[#f4f4f6] via-[#ebebef] to-[#dcdce2]"}`}>
                {unlocked ? (
                  <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[15px] border border-[#a37338]/35">
                    <Motif size={27} strokeWidth={1.2} className={`absolute bottom-[12%] left-[6%] ${motifColor}`} />
                    <Motif size={19} strokeWidth={1.2} className={`absolute right-[8%] top-[12%] ${motifColor}`} />
                  </div>
                ) : (
                  <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[15px] border border-[#9c9ca6]/35" />
                )}
                <div className={`absolute aspect-square h-[77%] rounded-full ${unlocked ? "bg-[#fffaf5]/55" : "bg-white/55"}`} aria-hidden="true" />
                <div className="relative aspect-square h-full max-w-full">
                  {unlocked ? (
                    <Image
                      key={outfit.id}
                      src={image}
                      fill
                      priority
                      sizes="(max-width: 639px) 75vw, 352px"
                      alt={`${outfit.name}を着たミニかなこ`}
                      className="object-contain drop-shadow-[0_5px_9px_rgba(85,49,66,0.15)]"
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label="未解放の衣装のシルエット"
                      className="absolute inset-0 bg-gradient-to-b from-[#9696a0] via-[#a3a3ad] to-[#b9b9c2]"
                      style={{ mask: silhouette, WebkitMask: silhouette }}
                    />
                  )}
                </div>
              </div>
              <figcaption className="flex min-h-10 flex-wrap items-center justify-between gap-x-2 px-3 py-1.5" aria-live="polite">
                <span className={`text-sm font-bold sm:text-base ${unlocked ? "text-[var(--ink)]" : "text-[#595963]"}`}>
                  {unlocked ? outfit.name : `${selectedIndex + 1}着目`}
                </span>
                {!unlocked && (
                  <span className="text-xs font-semibold text-[#65656f]">はなまる{outfit.requiredStreak}日連続で解放</span>
                )}
              </figcaption>
            </figure>

            <div className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2" role="group" aria-label="衣装のプレビュー">
              {visibleOutfits.map(({ id, name }, index) => {
                const isWearing = id === activeOutfit;
                const isLocked = !unlockedOutfits.includes(id);
                const selected = id === outfit.id;
                const label = isLocked ? `${index + 1}着目` : outfitPreviews[id].label;
                const appearance = isLocked
                  ? (selected ? "border-[#82828e] bg-[#e4e4e9] text-[#45454f]" : "border-[#d8d8de] bg-[#f2f2f4] text-[#65656f] hover:bg-[#e9e9ed]")
                  : (selected ? outfitPreviews[id].selected : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:bg-[#fbebef]");

                return (
                  <button
                    key={id}
                    ref={selected ? selectedPreviewButton : undefined}
                    type="button"
                    aria-label={isLocked ? `${label}、未解放` : isWearing ? `${name}、着用中` : name}
                    aria-pressed={selected}
                    onClick={() => setPreviewOutfit(id)}
                    className={`tap-target flex min-w-0 items-center justify-center gap-1 rounded-xl border px-1 text-xs font-bold sm:text-sm ${appearance}`}
                  >
                    {isWearing && <Check size={14} className="shrink-0" aria-hidden="true" />}
                    {isLocked && <LockKeyhole size={13} className="shrink-0" aria-hidden="true" />}
                    {label}
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
                <p role="status" className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-sm font-bold tabular-nums ${unlocked ? "bg-[#f5e8eb] text-[var(--muted)]" : "bg-[#f0f0f2] text-[#595963]"}`}>
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
