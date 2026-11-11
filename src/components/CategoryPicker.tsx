"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { getIcon } from "@/lib/icons";
import type { Category, CategoryType } from "@/types";

interface Props {
  selectedId?: string;
  onSelect: (categoryId: string) => void;
  filterType?: CategoryType;
}

const singlePageLimit = 12;

export function CategoryPicker({ selectedId, onSelect, filterType }: Props) {
  const categories = useBudgetStore((s) => s.categories);
  const [page, setPage] = useState(0);

  const visible = useMemo(() => {
    const list = filterType
      ? categories.filter((c) => c.type === filterType)
      : categories;
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories, filterType]);
  const categoriesPerPage = visible.length > singlePageLimit ? 8 : singlePageLimit;
  const pageCount = Math.ceil(visible.length / categoriesPerPage);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const start = currentPage * categoriesPerPage;

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">カテゴリ</legend>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-bold text-[#755d62]" aria-hidden="true">カテゴリ</p>
        {pageCount > 1 && (
          <div className="flex items-center gap-1 text-xs font-bold tabular-nums text-[#755d62]">
            <button
              type="button"
              aria-label="前のカテゴリページ"
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
              className="tap-target grid place-items-center rounded-lg text-[#a53c55] enabled:hover:bg-[#fbebef] disabled:opacity-35"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <span aria-live="polite">{currentPage + 1}/{pageCount}</span>
            <button
              type="button"
              aria-label="次のカテゴリページ"
              disabled={currentPage === pageCount - 1}
              onClick={() => setPage(currentPage + 1)}
              className="tap-target grid place-items-center rounded-lg text-[#a53c55] enabled:hover:bg-[#fbebef] disabled:opacity-35"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {visible.slice(start, start + categoriesPerPage).map((category) => (
          <CategoryTile
            key={category.id}
            category={category}
            selected={category.id === selectedId}
            onClick={() => onSelect(category.id)}
          />
        ))}
      </div>
      {visible.length === 0 && <p className="py-2 text-sm text-[#755d62]">この種類のカテゴリはありません。</p>}
    </fieldset>
  );
}

function CategoryTile({
  category,
  selected,
  onClick,
}: {
  category: Category;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = getIcon(category.icon);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`tap-target flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-0.5 ${
        selected
          ? "border-[#a53c55] bg-[#f9e8ed] ring-1 ring-inset ring-[#a53c55]/20"
          : "border-[#ecd9dd] bg-[#fffcf8] hover:bg-[#fbebef]"
      }`}
    >
      <div
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full bg-${category.color}-100 text-${category.color}-700`}
      >
        <Icon size={14} aria-hidden="true" />
      </div>
      <span className="w-full truncate text-center text-[11px] font-semibold leading-tight text-[#40262d]">
        {category.name}
      </span>
    </button>
  );
}
