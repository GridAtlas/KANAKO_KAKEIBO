"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { getIcon } from "@/lib/icons";
import { FixedCostForm } from "@/components/FixedCostForm";
import { formatYen } from "@/lib/money";
import { SettingsListPager } from "@/components/SettingsListPager";
import type { FixedCost } from "@/types";

const PAGE_SIZE = 5;

export default function FixedPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const fixedCosts = useBudgetStore((s) => s.fixedCosts);
  const removeFixedCost = useBudgetStore((s) => s.removeFixedCost);
  const getCategoryById = useBudgetStore((s) => s.getCategoryById);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FixedCost | null>(null);
  const [requestedPage, setRequestedPage] = useState(0);
  const pages = Math.max(1, Math.ceil(fixedCosts.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pages - 1);
  const visible = fixedCosts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
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
        <h1 className="font-bold text-[#3b2721]">固定費の設定</h1>
      </header>

      {!hydrated ? (
        <div className="text-center text-sm text-stone-400 py-6">読み込み中…</div>
      ) : showForm || editing ? (
        <section className="rounded-[20px] border border-[#eadccf] bg-[#fffdf9] p-3" aria-label={editing ? "固定費を編集" : "固定費を追加"}>
          <FixedCostForm
            initial={editing ?? undefined}
            onSubmit={() => {
              if (!editing) setRequestedPage(Math.floor(fixedCosts.length / PAGE_SIZE));
              closeForm();
            }}
            onCancel={closeForm}
            onDelete={editing ? () => {
              if (confirm("この固定費設定を削除しますか？")) {
                removeFixedCost(editing.id);
                closeForm();
              }
            } : undefined}
          />
        </section>
      ) : (
        <>
          <button type="button" onClick={() => setShowForm(true)} className="tap-target flex w-full items-center justify-center gap-1 rounded-xl bg-[#a13e34] px-3 text-sm font-bold text-white hover:bg-[#862e28]">
            <Plus size={18} aria-hidden="true" />
            固定費を追加
          </button>
          {visible.length ? (
            <ul className="divide-y divide-[#f0e5db] overflow-hidden rounded-[20px] border border-[#eadccf] bg-[#fffdf9]" aria-label="固定費">
              {visible.map((fixed) => {
                const category = getCategoryById(fixed.categoryId);
                const Icon = getIcon(category?.icon ?? "HelpCircle");
                const color = category?.color ?? "slate";
                return (
                  <li key={fixed.id}>
                    <button type="button" onClick={() => setEditing(fixed)} className="tap-target flex min-h-12 w-full items-center gap-2 px-2 text-left hover:bg-[#faf2ea]">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-${color}-100 text-${color}-700`}>
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-[#3b2721]">{fixed.label || category?.name || "削除済カテゴリ"}</span>
                        <span className="block text-xs text-[#765b50]">毎月{fixed.paymentDay}日{!fixed.active && "・停止中"}</span>
                      </span>
                      <span className="max-w-[42%] break-all text-right text-sm font-bold tabular-nums">{formatYen(fixed.amount)}</span>
                      <Pencil size={14} className="shrink-0 text-[#765b50]" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-1 py-2 text-sm text-[#765b50]">固定費はまだありません。</p>
          )}
          <SettingsListPager page={page} pages={pages} onChange={setRequestedPage} />
        </>
      )}
    </main>
  );
}
