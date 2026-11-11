import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_KANAKO_BASE_PATH ?? "";

export default function TitlePage() {
  return (
    <main className="compact-page flex flex-1 flex-col items-center justify-center gap-3 px-3 py-3 sm:gap-4 sm:px-5">
      <div className="relative isolate aspect-square w-full max-w-[min(100%,58dvh,28rem)] overflow-hidden rounded-[24px] bg-[#f2d5c7]">
        <Image
          src={`${basePath}/images/kanako-title.jpg`}
          alt="家計簿をつけるかなこの表紙イラスト"
          fill
          priority
          sizes="(max-width: 448px) 90vw, 448px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#38251e]/80 via-transparent to-transparent" />
        <h1 className="absolute inset-x-4 bottom-4 text-center text-[clamp(1.4rem,6vw,2.3rem)] font-bold leading-tight tracking-tight text-white drop-shadow-sm">
          かなこの家計簿
        </h1>
      </div>
      <Link
        href="/today"
        className="tap-target inline-flex w-full max-w-[min(100%,58dvh,28rem)] items-center justify-center gap-2 rounded-xl bg-[#a13e34] px-4 text-sm font-bold text-white hover:bg-[#862e28]"
      >
        家計簿を開く
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </main>
  );
}
