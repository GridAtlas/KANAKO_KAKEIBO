"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { getIcon } from "@/lib/icons";
import { CategoryForm } from "@/components/CategoryForm";
import { SettingsListPager } from "@/components/SettingsListPager";
import type { Category } from "@/types";

const PAGE_SIZE = 5;

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
  const [requestedPage, setRequestedPage] = useState(0);
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pages - 1);
  const first = page * PAGE_SIZE;
  const visible = sorted.slice(first, first + PAGE_SIZE);
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const move = (id: string, delta: number) => {
    const ids = sorted.map((c) => c.id);
    const idx = ids.indexOf(id);
    const to = idx + delta;
    if (to < 0 || to >= ids.length) return;
    [ids[idx], ids[to]] = [ids[to], ids[idx]];
    reorderCategories(ids);
    setRequestedPage(Math.floor(to / PAGE_SIZE));
  };

  return (
    <main className="compact-page flex-1 space-y-2 px-3 py-2">
      <header className="flex min-h-12 items-center gap-1 border-b border-[#eadccf]">
        <Link
          href="/settings"
          className="tap-target grid place-items-center rounded-lg text-[#983e34] hover:bg-[#f4e7dc]"
          aria-label="設定へ戻る"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-bold text-[#3b2721]">カテゴリ管理</h1>
      </header>

      {!hydrated ? (
        <div className="text-center text-sm text-stone-400 py-6">読み込み中…</div>
      ) : showForm || editing ? (
        <section className="rounded-[20px] border border-[#eadccf] bg-[#fffdf9] p-3" aria-label={editing ? "カテゴリを編集" : "カテゴリを追加"}>
          <CategoryForm
            initial={editing ?? undefined}
            onSubmit={() => {
              if (!editing) setRequestedPage(Math.floor(sorted.length / PAGE_SIZE));
              closeForm();
            }}
            onCancel={closeForm}
            onDelete={editing ? () => {
              if (confirm(`「${editing.name}」を削除しますか？関連する取引履歴は残ります。`)) {
                removeCategory(editing.id);
                closeForm();
              }
            } : undefined}
          />
        </section>
      ) : (
        <>
          <button type="button" onClick={() => setShowForm(true)} className="tap-target flex w-full items-center justify-center gap-1 rounded-xl bg-[#a13e34] px-3 text-sm font-bold text-white hover:bg-[#862e28]">
            <Plus size={18} aria-hidden="true" />
            カテゴリを追加
          </button>
          {visible.length ? (
            <ul className="divide-y divide-[#f0e5db] overflow-hidden rounded-[20px] border border-[#eadccf] bg-[#fffdf9]" aria-label="カテゴリ">
              {visible.map((category, offset) => {
                const index = first + offset;
                const Icon = getIcon(category.icon);
                return (
                  <li key={category.id} className="flex items-center px-1">
                    <button type="button" onClick={() => setEditing(category)} className="tap-target flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-left hover:bg-[#faf2ea]">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-${category.color}-100 text-${category.color}-700`}>
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#3b2721]">{category.name}</span>
                        <span className="block text-xs text-[#765b50]">{category.isFixedCost ? "固定費" : category.type === "income" ? "収入" : "支出"}</span>
                      </span>
                      <Pencil size={14} className="shrink-0 text-[#765b50]" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => move(category.id, -1)} disabled={index === 0} aria-label={`${category.name}を上へ`} className="tap-target grid place-items-center rounded-lg text-[#765b50] enabled:hover:bg-[#faf2ea] disabled:opacity-30">
                      <ChevronUp size={17} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => move(category.id, 1)} disabled={index === sorted.length - 1} aria-label={`${category.name}を下へ`} className="tap-target grid place-items-center rounded-lg text-[#765b50] enabled:hover:bg-[#faf2ea] disabled:opacity-30">
                      <ChevronDown size={17} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-1 py-2 text-sm text-[#765b50]">カテゴリはまだありません。</p>
          )}
          <SettingsListPager page={page} pages={pages} onChange={setRequestedPage} />
        </>
      )}
    </main>
  );
}
