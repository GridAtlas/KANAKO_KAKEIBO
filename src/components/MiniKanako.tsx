import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { MiniKanakoStage } from "@/lib/dailyBudget";

const assetBasePath = process.env.NODE_ENV === "production" ? "/KANAKO_KAKEIBO" : "";

const stages = [
  { label: "まんまるかなこ", message: "レシートの山に埋もれそう！" },
  { label: "ふっくらかなこ", message: "お財布がびっくり。明日は整えよう。" },
  { label: "いつものかなこ", message: "今日も一緒に、はなまるを目指そう。" },
  { label: "すらっとかなこ", message: "いい調子。足取りも軽くなったよ。" },
  { label: "きらめきかなこ", message: "はなまるパワーで、今日もキラキラ！" },
];

export function MiniKanako({
  stage,
  hasGoal,
}: {
  stage: MiniKanakoStage;
  hasGoal: boolean;
}) {
  const index = stage + 2;
  const { label, message } = stages[index];

  return (
    <section className="relative isolate flex min-h-[210px] min-w-0 items-center overflow-hidden rounded-[26px] border border-[#eccfc1] bg-gradient-to-br from-[#f9e5d8] via-[#f5ded2] to-[#f2d2c5] px-5 py-5 sm:min-h-[242px] sm:px-7">
      <div className="relative z-10 w-[53%]">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-[#983e34]">
          <Sparkles size={17} aria-hidden="true" />
          ミニかなこ
        </h2>
        <div aria-live="polite">
          <p className="mt-2 text-xl font-bold leading-tight tracking-tight text-[#432923] sm:text-2xl">{label}</p>
          <p className="mt-2 text-xs font-medium leading-relaxed text-[#674b40] sm:text-sm">
            {hasGoal ? message : "目標を設定するところから、一緒に始めよう。"}
          </p>
        </div>
        <div className="mt-4 flex gap-1.5" role="img" aria-label={`5段階のうち${index + 1}段階目`}>
          {stages.map(({ label: stageLabel }, position) => (
            <span key={stageLabel} className={`h-1.5 w-3 rounded-full ${position === index ? "bg-[#a13e34]" : "bg-[#d7a99a]"}`} />
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-y-0 -right-5 flex w-[58%] items-center justify-center sm:-right-2">
        <div className="absolute h-[68%] max-h-52 w-[77%] max-w-52 rounded-full bg-[#fff5e7]/70" />
        <div className="relative aspect-square w-full max-w-[275px]">
          <Image
            key={index}
            src={`${assetBasePath}/images/mini-kanako-${index}.webp`}
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 55vw, 270px"
            className="object-contain drop-shadow-[0_8px_10px_rgba(117,61,42,0.14)]"
          />
        </div>
      </div>
    </section>
  );
}
