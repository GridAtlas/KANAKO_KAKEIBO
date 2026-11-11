import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flower } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_KANAKO_BASE_PATH ?? "";

export default function TitlePage() {
  return (
    <main className="compact-page flex flex-1 flex-col items-center justify-center px-4 py-3 sm:px-5">
      <div className="w-full max-w-[min(100%,54dvh,27rem)] text-center">
        <div className="cover-frame relative isolate aspect-square overflow-hidden rounded-[20px] border border-[#d8b49a] bg-[#f6e1d5]">
          <Image
            src={`${basePath}/images/kanako-title.jpg`}
            alt="家計簿をつけるかなこの表紙イラスト"
            fill
            priority
            sizes="(max-width: 448px) 90vw, 432px"
            className="object-cover"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-[6px] rounded-[14px] border border-white/75" />
        </div>
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
