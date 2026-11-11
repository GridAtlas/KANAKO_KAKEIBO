"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Flower } from "lucide-react";
import { useRef } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";

const basePath = process.env.NEXT_PUBLIC_KANAKO_BASE_PATH ?? "";
const tapIntervalMs = 1000;

export default function TitlePage() {
  const router = useRouter();
  const coverTaps = useRef({ count: 0, lastTap: -Infinity });

  function tapCover() {
    const now = performance.now();
    const { count, lastTap } = coverTaps.current;
    const nextCount = now - lastTap <= tapIntervalMs ? count + 1 : 1;
    coverTaps.current = { count: nextCount, lastTap: now };
    if (nextCount !== 5) return;

    coverTaps.current.count = 0;
    const { activeOutfit, debugOutfit, setDebugOutfit } = useBudgetStore.getState();
    setDebugOutfit(debugOutfit ?? activeOutfit);
    router.push("/wardrobe");
  }

  return (
    <main className="compact-page flex flex-1 flex-col items-center justify-center px-4 py-3 sm:px-5">
      <div className="w-full max-w-[min(100%,54dvh,27rem)] text-center">
        <button
          type="button"
          aria-label="表紙のかなこ"
          onClick={tapCover}
          className="cover-frame relative isolate block aspect-square w-full touch-manipulation select-none overflow-hidden rounded-[20px] border border-[#d8b49a] bg-[#f6e1d5]"
        >
          <Image
            src={`${basePath}/images/kanako-title.jpg`}
            alt="家計簿をつけるかなこの表紙イラスト"
            fill
            priority
            sizes="(max-width: 448px) 90vw, 432px"
            className="object-cover"
            draggable={false}
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-[6px] rounded-[14px] border border-white/75" />
        </button>
        <div className="mt-4 flex items-center justify-center gap-2.5 sm:mt-5">
          <Flower size={20} strokeWidth={1.45} className="shrink-0 text-[var(--gold)]" aria-hidden="true" />
          <h1 className="text-[clamp(1.45rem,6.5vw,2.2rem)] font-bold leading-tight tracking-tight text-[var(--ink)]">
            かなこの家計簿
          </h1>
        </div>
        <Link
          href="/today"
          className="tap-target mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-bold text-white shadow-[0_4px_10px_rgba(165,60,85,0.18)] hover:bg-[var(--accent-hover)] sm:mt-5 sm:min-h-12"
        >
          家計簿を開く
          <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
