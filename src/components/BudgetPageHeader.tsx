import Link from "next/link";
import { CalendarDays, Flower } from "lucide-react";

export function BudgetPageHeader({ dateLabel }: { dateLabel?: string }) {
  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-[#eadccf] pb-3 md:pb-4">
      <Link href="/" className="tap-target inline-flex items-center gap-2.5 rounded-lg text-[#3b2721]">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-[#f4ded5] text-[#a13e34]">
          <Flower size={24} strokeWidth={1.65} aria-hidden="true" />
        </span>
        <span className="text-base font-bold tracking-tight sm:text-lg">かなこの家計簿</span>
      </Link>
      {dateLabel && (
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#765b50] sm:text-sm">
          <CalendarDays size={16} aria-hidden="true" />
          {dateLabel}
        </span>
      )}
    </header>
  );
}
