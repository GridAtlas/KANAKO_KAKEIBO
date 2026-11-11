import { ChevronLeft, ChevronRight } from "lucide-react";

export function SettingsListPager({ page, pages, onChange }: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) return null;

  return (
    <nav aria-label="設定一覧のページ" className="mt-1 flex items-center justify-center gap-2 text-[#765b50]">
      <button type="button" aria-label="前のページ" disabled={page === 0} onClick={() => onChange(page - 1)} className="tap-target grid place-items-center rounded-lg enabled:hover:bg-[#f4e7dc] disabled:opacity-35">
        <ChevronLeft size={19} aria-hidden="true" />
      </button>
      <span aria-live="polite" className="min-w-12 text-center text-xs font-bold tabular-nums">{page + 1} / {pages}</span>
      <button type="button" aria-label="次のページ" disabled={page + 1 >= pages} onClick={() => onChange(page + 1)} className="tap-target grid place-items-center rounded-lg enabled:hover:bg-[#f4e7dc] disabled:opacity-35">
        <ChevronRight size={19} aria-hidden="true" />
      </button>
    </nav>
  );
}
