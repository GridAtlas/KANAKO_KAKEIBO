"use client";

import { useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { formatYen } from "@/lib/money";
import { useBudgetStore } from "@/store/useBudgetStore";
import type { TransactionPresetInput } from "@/types";

const PAGE_SIZE = 3;

export function TransactionPresets({
  draft,
  onSelect,
}: {
  draft?: TransactionPresetInput;
  onSelect: (preset: TransactionPresetInput) => void;
}) {
  const presets = useBudgetStore((state) => state.transactionPresets);
  const categories = useBudgetStore((state) => state.categories);
  const addPreset = useBudgetStore((state) => state.addTransactionPreset);
  const removePreset = useBudgetStore((state) => state.removeTransactionPreset);
  const [open, setOpen] = useState(false);
  const [requestedPage, setRequestedPage] = useState(0);

  const pages = Math.max(1, Math.ceil(presets.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pages - 1);
  const end = presets.length - page * PAGE_SIZE;
  const visible = presets.slice(Math.max(0, end - PAGE_SIZE), end).reverse();
  const canAdd = draft && categories.some((category) => category.id === draft.categoryId && category.type === "expense");
  const alreadySaved = canAdd && presets.some((preset) =>
    preset.categoryId === draft.categoryId && preset.amount === draft.amount &&
    preset.memo === (draft.memo?.trim() || undefined),
  );

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          setRequestedPage(0);
          setOpen(true);
        }}
        className="tap-target inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-xl border border-[var(--line)] bg-[var(--surface)] px-1.5 text-xs font-bold text-[var(--accent)] hover:bg-[#fcf1f4]"
      >
        <Bookmark size={14} aria-hidden="true" />
        よく使う支出
      </button>

      {open && (
        <Modal labelledBy="transaction-presets-title" onClose={() => setOpen(false)} className="rounded-[22px] p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 id="transaction-presets-title" className="font-bold text-[var(--ink)]">よく使う支出</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="閉じる" className="tap-target grid place-items-center rounded-xl text-[var(--muted)] hover:bg-[#fcf1f4]">
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {visible.length > 0 ? (
            <ul className="divide-y divide-[var(--line)] overflow-hidden rounded-xl border border-[var(--line)]">
              {visible.map((preset) => {
                const category = categories.find((item) => item.id === preset.categoryId);
                const label = preset.memo || category?.name || "削除済みのカテゴリ";
                const usable = category?.type === "expense";

                return (
                  <li key={preset.id} className="flex min-w-0 items-center">
                    <button
                      type="button"
                      disabled={!usable}
                      onClick={() => {
                        onSelect({ categoryId: preset.categoryId, amount: preset.amount, memo: preset.memo });
                        setOpen(false);
                      }}
                      className="tap-target flex min-h-12 min-w-0 flex-1 items-center justify-between gap-2 px-2.5 text-left enabled:hover:bg-[#fcf1f4] disabled:text-[var(--muted)]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">{label}</span>
                        {(!usable || preset.memo) && (
                          <span className="block truncate text-xs text-[var(--muted)]">{usable ? category.name : "カテゴリを選べません"}</span>
                        )}
                      </span>
                      <span className="max-w-[48%] break-all text-right text-xs font-bold tabular-nums">{formatYen(preset.amount)}</span>
                    </button>
                    <button
                      type="button"
                      aria-label={`${label}をよく使う支出から削除`}
                      onClick={() => {
                        if (window.confirm(`「${label}」をよく使う支出から削除しますか？`)) removePreset(preset.id);
                      }}
                      className="tap-target grid shrink-0 place-items-center rounded-lg text-[var(--muted)] hover:bg-[#fcf1f4] hover:text-[var(--accent)]"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-xl bg-[var(--paper)] px-3 py-2.5 text-sm text-[var(--muted)]">まだ登録されていません。</p>
          )}

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2" role="group" aria-label="よく使う支出のページ">
              <button type="button" onClick={() => setRequestedPage(page - 1)} disabled={page === 0} aria-label="前のページ" className="tap-target grid place-items-center rounded-lg text-[var(--accent)] enabled:hover:bg-[#fcf1f4] disabled:opacity-40">
                <ChevronLeft size={19} aria-hidden="true" />
              </button>
              <span aria-live="polite" className="min-w-12 text-center text-xs font-semibold tabular-nums text-[var(--muted)]">{page + 1} / {pages}</span>
              <button type="button" onClick={() => setRequestedPage(page + 1)} disabled={page + 1 >= pages} aria-label="次のページ" className="tap-target grid place-items-center rounded-lg text-[var(--accent)] enabled:hover:bg-[#fcf1f4] disabled:opacity-40">
                <ChevronRight size={19} aria-hidden="true" />
              </button>
            </div>
          )}

          {canAdd ? (
            <button
              type="button"
              disabled={alreadySaved}
              onClick={() => {
                if (addPreset(draft)) setRequestedPage(0);
              }}
              className="tap-target mt-2 w-full rounded-xl bg-[var(--accent)] px-3 text-sm font-bold text-white enabled:hover:bg-[var(--accent-hover)] disabled:bg-[#f7e7eb] disabled:text-[var(--muted)]"
            >
              {alreadySaved ? "この入力は登録済み" : "この入力を登録"}
            </button>
          ) : (
            <p className="mt-2 px-1 text-xs text-[var(--muted)]">追加するには、先に金額とカテゴリを入力してください。</p>
          )}
          <p role="status" className="sr-only">{alreadySaved ? "この入力はよく使う支出に登録されています。" : ""}</p>
        </Modal>
      )}
    </>
  );
}
