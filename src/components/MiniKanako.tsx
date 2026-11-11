import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MiniKanakoStage } from "@/lib/dailyBudget";
import { getOutfitImage, type OutfitId } from "@/lib/wardrobe";

const stageNames = ["まんまる", "ふっくら", "いつもの", "すらっと", "きらめき"];

export function MiniKanako({ stage, outfit }: { stage: MiniKanakoStage; outfit: OutfitId }) {
  return (
    <Link
      href="/wardrobe"
      aria-label="着せ替え"
      className="tap-target flex min-w-0 flex-col items-center gap-0.5 rounded-[17px] bg-[#f9e9de] px-1 pb-2 pt-1 text-[#983e34] hover:bg-[#f5dfd3] sm:rounded-[20px] sm:pb-3"
    >
      <span className="relative aspect-square w-full max-w-[11rem]">
        <span className="absolute inset-[13%] rounded-full bg-[#fff7ec]" />
        <Image
          src={getOutfitImage(outfit, stage)}
          alt={`${stageNames[stage + 2]}ミニかなこ`}
          fill
          priority
          sizes="(max-width: 640px) 34vw, 176px"
          className="object-contain"
        />
      </span>
      <span className="inline-flex items-center gap-0.5 text-xs font-bold sm:text-sm">
        着せ替え
        <ChevronRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}
