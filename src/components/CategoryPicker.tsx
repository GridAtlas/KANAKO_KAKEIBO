"use client";

import { useMemo } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { getIcon } from "@/lib/icons";
import type { Category, CategoryType } from "@/types";

interface Props {
  selectedId?: string;
  onSelect: (categoryId: string) => void;
  filterType?: CategoryType;
}

export function CategoryPicker({ selectedId, onSelect, filterType }: Props) {
  const categories = useBudgetStore((s) => s.categories);

  const visible = useMemo(() => {
    const list = filterType
      ? categories.filter((c) => c.type === filterType)
      : categories;
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories, filterType]);

  return (
    <div className="grid grid-cols-4 gap-2">
      {visible.map((c) => (
        <CategoryTile
          key={c.id}
          category={c}
          selected={c.id === selectedId}
          onClick={() => onSelect(c.id)}
        />
      ))}
    </div>
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
      className={`tap-target flex flex-col items-center justify-center gap-1 rounded-xl p-2 border transition ${
        selected
          ? `bg-${category.color}-100 border-${category.color}-300 ring-2 ring-${category.color}-300`
          : "bg-white border-slate-200 active:bg-slate-100"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center bg-${category.color}-100 text-${category.color}-700`}
      >
        <Icon size={18} />
      </div>
      <span className="text-[11px] font-medium truncate w-full text-center">
        {category.name}
      </span>
    </button>
  );
}
