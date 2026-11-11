import Link from "next/link";
import { ChevronRight, Repeat, Tags, Target } from "lucide-react";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";

const settings = [
  { href: "/settings/daily-budget", icon: Target, label: "1日の支出目標" },
  { href: "/settings/categories", icon: Tags, label: "カテゴリ管理" },
  { href: "/settings/fixed", icon: Repeat, label: "固定費の設定" },
];

export default function SettingsPage() {
  return (
    <main className="compact-page flex-1 px-3 py-2 sm:p-5">
      <BudgetPageHeader />
      <h1 className="my-3 text-lg font-bold text-[#3b2721]">設定</h1>
      <div className="divide-y divide-[#f0e5db] overflow-hidden rounded-[20px] border border-[#eadccf] bg-[#fffdf9]">
        {settings.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="tap-target flex items-center gap-3 px-3 py-3 text-sm font-bold text-[#3b2721] hover:bg-[#faf2ea]">
            <Icon size={19} className="shrink-0 text-[#a13e34]" aria-hidden="true" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={17} className="text-[#765b50]" aria-hidden="true" />
          </Link>
        ))}
      </div>
      <p className="mt-3 px-1 text-xs leading-relaxed text-[#765b50]">
        家計簿のデータは、このブラウザーに保存されます。
      </p>
    </main>
  );
}
