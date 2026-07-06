"use client";

import { useState } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { formatYenNoSign, parseYenInput } from "@/lib/money";
import type { FixedCost } from "@/types";

interface Props {
  initial?: FixedCost;
  onSubmit: () => void;
  onCancel: () => void;
}

export function FixedCostForm({ initial, onSubmit, onCancel }: Props) {
  const addFixedCost = useBudgetStore((s) => s.addFixedCost);
  const updateFixedCost = useBudgetStore((s) => s.updateFixedCost);
  const categories = useBudgetStore((s) => s.categories);

  const fixedExpenseCategories = [...categories]
    .filter((c) => c.type === "expense")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const [categoryId, setCategoryId] = useState<string>(
    initial?.categoryId ?? fixedExpenseCategories[0]?.id ?? "",
  );
  const [amountStr, setAmountStr] = useState<string>(
    initial ? String(initial.amount) : "",
  );
  const [paymentDay, setPaymentDay] = useState<number>(
    initial?.paymentDay ?? 27,
  );
  const [label, setLabel] = useState<string>(initial?.label ?? "");
  const [active, setActive] = useState<boolean>(initial?.active ?? true);

  const amount = parseYenInput(amountStr);
  const canSubmit = amount > 0 && !!categoryId && paymentDay >= 1 && paymentDay <= 31;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (initial) {
      updateFixedCost(initial.id, {
        categoryId,
        amount,
        paymentDay,
        label: label.trim() || undefined,
        active,
      });
    } else {
      addFixedCost({
        categoryId,
        amount,
        paymentDay,
        label: label.trim() || undefined,
        active,
      });
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-slate-500 mb-1">カテゴリ</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-xl bg-white border border-slate-200 px-3 py-3"
        >
          {fixedExpenseCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.isFixedCost ? " (固定)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">金額</label>
        <div className="flex items-center rounded-xl bg-white border border-slate-200 px-4 py-3">
          <span className="text-xl font-bold text-slate-400 mr-2">¥</span>
          <input
            type="text"
            inputMode="numeric"
            value={amountStr === "" ? "" : formatYenNoSign(amount)}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="0"
            className="num flex-1 outline-none text-xl font-bold bg-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">
          支払い日（毎月）
        </label>
        <input
          type="number"
          min={1}
          max={31}
          value={paymentDay}
          onChange={(e) => setPaymentDay(Number(e.target.value) || 1)}
          className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3"
        />
        <p className="text-[11px] text-slate-500 mt-1">
          月末が該当日より少ない月（例: 2 月の 30 日）は月末に自動調整
        </p>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">
          ラベル（任意）
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="例: Netflix, 家賃"
          className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="w-5 h-5 accent-emerald-500"
        />
        <span>有効（毎月自動計上）</span>
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="tap-target flex-1 rounded-xl bg-slate-200 text-slate-700 py-2 font-semibold active:bg-slate-300"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="tap-target flex-1 rounded-xl bg-emerald-600 text-white py-2 font-semibold active:bg-emerald-700 disabled:opacity-40"
        >
          {initial ? "更新" : "追加"}
        </button>
      </div>
    </form>
  );
}
