"use client";

import { useState, type FormEvent } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { formatYenNoSign, parseYenInput } from "@/lib/money";
import type { FixedCost } from "@/types";

interface Props {
  initial?: FixedCost;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const fieldClass = "mt-1 min-h-11 w-full min-w-0 rounded-lg border border-[var(--line)] bg-white px-2 text-[var(--ink)]";

export function FixedCostForm({ initial, onSubmit, onCancel, onDelete }: Props) {
  const addFixedCost = useBudgetStore((s) => s.addFixedCost);
  const updateFixedCost = useBudgetStore((s) => s.updateFixedCost);
  const categories = useBudgetStore((s) => s.categories);
  const expenseCategories = categories.filter((category) => category.type === "expense").sort((a, b) => a.sortOrder - b.sortOrder);

  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? expenseCategories[0]?.id ?? "");
  const [amountStr, setAmountStr] = useState(initial ? String(initial.amount) : "");
  const [paymentDay, setPaymentDay] = useState(initial?.paymentDay ?? 27);
  const [label, setLabel] = useState(initial?.label ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  const amount = parseYenInput(amountStr);
  const canSubmit = amount > 0 && !!categoryId && paymentDay >= 1 && paymentDay <= 31;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    const fields = { categoryId, amount, paymentDay, label: label.trim() || undefined, active };
    if (initial) updateFixedCost(initial.id, fields);
    else addFixedCost(fields);
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-[var(--ink)]">
      <div className="grid grid-cols-2 gap-2">
        <div className="min-w-0">
          <label htmlFor="fixed-category" className="block text-xs font-bold">カテゴリ</label>
          <select id="fixed-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className={fieldClass}>
            {categoryId && !expenseCategories.some((category) => category.id === categoryId) && (
              <option value={categoryId}>{categories.find((category) => category.id === categoryId)?.name ?? "削除済カテゴリ"}</option>
            )}
            {expenseCategories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}{category.isFixedCost ? "（固定）" : ""}</option>
            ))}
          </select>
        </div>
        <label className="min-w-0 text-xs font-bold">
          金額（円）
          <input
            type="text"
            inputMode="numeric"
            value={amountStr === "" ? "" : formatYenNoSign(amount)}
            onChange={(event) => setAmountStr(event.target.value)}
            placeholder="0"
            className={`${fieldClass} tabular-nums`}
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="min-w-0 text-xs font-bold">
          毎月の支払日
          <input type="number" min={1} max={31} value={paymentDay} onChange={(event) => setPaymentDay(Number(event.target.value) || 1)} className={fieldClass} />
        </label>
        <label className="min-w-0 text-xs font-bold">
          ラベル（任意）
          <input type="text" value={label} onChange={(event) => setLabel(event.target.value)} placeholder="例  家賃" className={fieldClass} />
        </label>
      </div>
      <p className="text-xs text-[var(--muted)]">支払日がない月は、月末に計上します。</p>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="h-5 w-5 accent-[var(--accent)]" />
        固定費の計上に含める
      </label>
      <div className="flex gap-2 pt-1">
        {onDelete && <button type="button" onClick={onDelete} className="tap-target rounded-lg px-2 text-xs font-bold text-[var(--accent)] hover:bg-[#fcf1f4]">削除</button>}
        <button type="button" onClick={onCancel} className="tap-target flex-1 rounded-lg bg-[#f9e5eb] px-1 text-xs font-bold text-[var(--muted)]">戻る</button>
        <button type="submit" disabled={!canSubmit} className="tap-target flex-1 rounded-lg bg-[var(--accent)] px-1 text-sm font-bold text-white disabled:opacity-40">
          {initial ? "更新" : "追加"}
        </button>
      </div>
    </form>
  );
}
