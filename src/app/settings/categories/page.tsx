"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { getIcon } from "@/lib/icons";
import { CategoryForm } from "@/components/CategoryForm";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const categories = useBudgetStore((s) => s.categories);
  const removeCategory = useBudgetStore((s) => s.removeCategory);
  const reorderCategories = useBudgetStore((s) => s.reorderCategories);

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const move = (id: string, delta: number) => {
    const ids = sorted.map((c) => c.id);
    const idx = ids.indexOf(id);
    const to = idx + delta;
    if (to < 0 || to >= ids.length) return;
    [ids[idx], ids[to]] = [ids[to], ids[idx]];
    reorderCategories(ids);
  };

  return (
    <div className="flex-1 p-3 pb-32 space-y-3">
      <header className="sticky top-0 bg-slate-50 pb-2 z-10 flex items-center gap-2 pt-1">
        <Link
          href="/settings"
          className="tap-target -ml-1 p-1 text-slate-500"
          aria-label="戻る"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-slate-700">カテゴリ管理</h1>
      </header>

      {!hydrated ? (
        <div className="text-center text-sm text-slate-400 py-6">読み込み中…</div>
      ) : showForm || editing ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-3">
          <CategoryForm
            initial={editing ?? undefined}
            onSubmit={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="tap-target w-full inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 text-white py-3 font-semibold active:bg-emerald-700"
        >
          <Plus size={18} />
          <span>カテゴリを追加</span>
        </button>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden divide-y divide-slate-100">
        {sorted.map((c, i) => {
          const Icon = getIcon(c.icon);
          return (
            <div key={c.id} className="flex items-center gap-2 px-3 py-2">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(c.id, -1)}
                  className="tap-target -my-1 h-6 flex items-center text-slate-400"
                  disabled={i === 0}
                  aria-label="上へ"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => move(c.id, 1)}
                  className="tap-target -my-1 h-6 flex items-center text-slate-400"
                  disabled={i === sorted.length - 1}
                  aria-label="下へ"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center bg-${c.color}-100 text-${c.color}-700`}
              >
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">{c.name}</span>
                  {c.isFixedCost && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded">
                      固定
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500">
                  {c.type === "expense" ? "支出" : "収入"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing(c)}
                className="tap-target p-1 text-slate-500 active:text-emerald-600"
                aria-label="編集"
              >
                <Pencil size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    confirm(
                      `「${c.name}」を削除しますか？（関連する取引履歴は残ります）`,
                    )
                  ) {
                    removeCategory(c.id);
                  }
                }}
                className="tap-target p-1 text-slate-400 active:text-rose-600"
                aria-label="削除"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
