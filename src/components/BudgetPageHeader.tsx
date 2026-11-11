import Link from "next/link";
import { CalendarDays, Flower } from "lucide-react";

export function BudgetPageHeader({ dateLabel }: { dateLabel?: string }) {
  return (
    <header className="flex min-h-12 items-center justify-between gap-2 border-b border-[#eadccf] sm:min-h-14">
      <Link href="/" className="tap-target inline-flex min-w-0 items-center gap-2 rounded-lg text-[#3b2721]">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f4ded5] text-[#a13e34] sm:h-9 sm:w-9">
          <Flower size={20} strokeWidth={1.65} aria-hidden="true" />
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
