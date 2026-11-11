import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import type { MiniKanakoStage } from "@/lib/dailyBudget";
import { getOutfitImage, type OutfitId } from "@/lib/wardrobe";

const stageNames = ["まんまる", "ふっくら", "いつもの", "すらっと", "きらめき"];

export function MiniKanako({ stage, outfit }: { stage: MiniKanakoStage; outfit: OutfitId }) {
  return (
    <Link
      href="/wardrobe"
      aria-label="着せ替え"
      className="tap-target flex min-w-0 flex-col items-center gap-0.5 rounded-[17px] px-1 pb-1 pt-1 text-[var(--accent)] hover:bg-white/45 sm:rounded-[20px] sm:pb-2"
    >
      <span className="relative aspect-square w-full max-w-[11rem]">
        <span className="absolute inset-[12%] rounded-full border border-white/80 bg-white/45" />
        <Sparkles size={18} strokeWidth={1.45} className="absolute right-[7%] top-[14%] text-[var(--gold)]" aria-hidden="true" />
        <Image
          src={getOutfitImage(outfit, stage)}
          alt={`${stageNames[stage + 2]}ミニかなこ`}
          fill
          priority
          sizes="(max-width: 640px) 34vw, 176px"
          className="object-contain drop-shadow-[0_4px_5px_rgba(96,51,48,0.15)]"
        />
      </span>
      <span className="inline-flex items-center gap-0.5 text-xs font-bold sm:text-sm">
        着せ替え
        <ChevronRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}
