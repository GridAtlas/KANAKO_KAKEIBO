import Link from "next/link";
import { BarChart3, BookOpen } from "lucide-react";
import { TitleHero } from "@/components/TitleHero";

export default function HomePage() {
  return (
    <main className="flex-1 p-3 pb-28 space-y-4">
      <TitleHero />

      <section className="grid gap-3">
        <HomeAction
          href="/dashboard"
          title="家計簿を見る"
          description="今月の収支、支出内訳、直近の履歴を確認"
          icon={<BookOpen size={22} />}
          primary
        />
        <HomeAction
          href="/trends"
          title="月ごとの推移を見る"
          description="貯金率、前月比、6か月の収入と支出を確認"
          icon={<BarChart3 size={22} />}
        />
      </section>
    </main>
  );
}

function HomeAction({
  href,
  title,
  description,
  icon,
  primary = false,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`tap-target flex items-center gap-3 rounded-2xl p-4 shadow-sm active:scale-[0.99] ${
        primary
          ? "bg-pink-500 text-white shadow-pink-200/80"
          : "border border-pink-100 bg-white/90 text-stone-800 shadow-pink-100/60"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          primary ? "bg-white/20 text-white" : "bg-pink-50 text-pink-600"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-base font-bold">{title}</span>
        <span
          className={`mt-0.5 block text-xs ${
            primary ? "text-pink-50" : "text-stone-500"
          }`}
        >
          {description}
        </span>
      </span>
    </Link>
  );
}
