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
      <h1 className="display-type my-3 text-xl font-bold text-[var(--ink)]">設定</h1>
      <div className="divide-y divide-[#f4e7e7] overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--surface)]">
        {settings.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="tap-target flex items-center gap-3 px-3 py-3 text-sm font-bold text-[var(--ink)] hover:bg-[#fcf1f4]">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[#f9e5eb] text-[var(--accent)]">
              <Icon size={17} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="flex-1">{label}</span>
            <ChevronRight size={17} className="text-[var(--muted)]" aria-hidden="true" />
          </Link>
        ))}
      </div>
      <p className="mt-3 px-1 text-xs leading-relaxed text-[var(--muted)]">
        家計簿のデータは、このブラウザーに保存されます。
      </p>
    </main>
  );
}
