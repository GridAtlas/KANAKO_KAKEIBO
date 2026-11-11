import Link from "next/link";
import { CalendarDays, Flower } from "lucide-react";

export function BudgetPageHeader({ dateLabel }: { dateLabel?: string }) {
  return (
    <header className="flex min-h-12 items-center justify-between gap-2 border-b border-[var(--line)] sm:min-h-14">
      <Link href="/" className="tap-target inline-flex min-w-0 items-center gap-2 rounded-lg text-[var(--ink)]">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[11px] bg-[var(--blush)] text-[var(--accent)] sm:h-9 sm:w-9">
          <Flower size={20} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <span className="display-type text-base font-bold tracking-tight sm:text-lg">かなこの家計簿</span>
      </Link>
      {dateLabel && (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold tabular-nums text-[var(--muted)] sm:text-sm">
          <CalendarDays size={15} strokeWidth={1.6} aria-hidden="true" />
          {dateLabel}
        </span>
      )}
    </header>
  );
}
