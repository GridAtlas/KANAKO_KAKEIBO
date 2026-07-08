import Image from "next/image";

export function TitleHero() {
  return (
    <section className="-mx-3 -mt-3 relative h-[360px] overflow-hidden bg-pink-100">
      <Image
        src="/images/kanako-title.jpg"
        alt="家計簿をつけるかなこのイラスト"
        fill
        priority
        sizes="(max-width: 448px) 100vw, 448px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-rose-950/45 via-rose-900/5 to-white/10" />
      <div className="absolute inset-x-0 bottom-0 px-5 pb-6 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink-100">
          Kanako Kakeibo
        </p>
        <h1 className="mt-1 text-3xl font-bold leading-tight drop-shadow-sm">
          かなこの家計簿VER0.2
        </h1>
        <p className="mt-2 text-sm font-medium text-pink-50 drop-shadow-sm">
          毎月の支出と貯金の流れを、やさしく見える化。
        </p>
      </div>
    </section>
  );
}
