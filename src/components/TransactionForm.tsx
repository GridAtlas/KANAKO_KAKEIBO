"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { todayLocal } from "@/lib/date";
import { formatYenNoSign, parseYenInput } from "@/lib/money";
import type { CategoryType } from "@/types";
import { CategoryPicker } from "./CategoryPicker";

const transactionTypes = [
  { id: "expense", label: "支出", selectedClass: "bg-white text-rose-700 shadow-sm" },
  { id: "income", label: "収入", selectedClass: "bg-white text-emerald-700 shadow-sm" },
] as const;

export function TransactionForm() {
  const router = useRouter();
  const addTransaction = useBudgetStore((state) => state.addTransaction);
  const [type, setType] = useState<CategoryType>("expense");
  const [amountInput, setAmountInput] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(todayLocal);
  const [memo, setMemo] = useState("");

  const amount = parseYenInput(amountInput);
  const invalidAmount = /[.．−-]/.test(amountInput) || !Number.isSafeInteger(amount);
  const canSubmit = !invalidAmount && amount > 0 && Boolean(categoryId && date);

  function selectType(nextType: CategoryType) {
    if (type === nextType) return;
    setType(nextType);
    setCategoryId("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    addTransaction({ categoryId, amount, date, memo: memo.trim() || undefined });
    router.push("/today");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-1.5">
      <div role="group" aria-label="取引の種類" className="grid grid-cols-2 gap-1 rounded-xl bg-[#f4e7dc] p-0.5">
        {transactionTypes.map(({ id, label, selectedClass }) => (
          <button
            key={id}
            type="button"
            aria-pressed={type === id}
            onClick={() => selectType(id)}
            className={`tap-target rounded-[10px] text-sm font-bold ${type === id ? selectedClass : "text-[#765b50]"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <div className="flex min-h-12 items-center gap-2 rounded-xl border border-[#eadccf] bg-[#fffdf9] px-3 focus-within:border-[#a13e34]">
          <label htmlFor="transaction-amount" className="shrink-0 text-sm font-bold text-[#765b50]">金額</label>
          <span className="ml-1 text-xl font-bold text-[#765b50]" aria-hidden="true">¥</span>
          <input
            id="transaction-amount"
            type="text"
            inputMode="decimal"
            required
            value={amountInput && !invalidAmount ? formatYenNoSign(amount) : amountInput}
            onChange={(event) => setAmountInput(event.target.value)}
            placeholder="0"
            aria-invalid={invalidAmount || undefined}
            aria-describedby={invalidAmount ? "transaction-amount-error" : undefined}
            className="num min-h-11 min-w-0 flex-1 bg-transparent text-xl font-bold text-[#3b2721] outline-none"
          />
        </div>
        {invalidAmount && (
          <p id="transaction-amount-error" className="mt-1 text-xs font-semibold text-rose-700">金額は正の整数で入力してください。</p>
        )}
      </div>

      <CategoryPicker key={type} selectedId={categoryId} onSelect={setCategoryId} filterType={type} />

      <details className="group rounded-xl border border-[#eadccf] bg-[#fffdf9]">
        <summary className="tap-target flex cursor-pointer list-none items-center justify-between gap-2 rounded-xl px-3 text-sm font-bold text-[#765b50] [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-1.5"><CalendarDays size={16} aria-hidden="true" />日付・メモ</span>
          <ChevronDown size={16} className="group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 px-2 pb-2">
          <input
            type="date"
            aria-label="日付"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="min-h-11 min-w-0 w-full rounded-lg border border-[#eadccf] bg-white px-1.5 text-base text-[#3b2721]"
          />
          <input
            type="text"
            aria-label="メモ（任意）"
            placeholder="メモ（任意）"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            className="min-h-11 min-w-0 w-full rounded-lg border border-[#eadccf] bg-white px-2 text-base text-[#3b2721]"
          />
        </div>
      </details>

      <button
        type="submit"
        disabled={!canSubmit}
        className="tap-target flex w-full items-center justify-center rounded-xl bg-[#a13e34] px-3 text-sm font-bold text-white enabled:hover:bg-[#862e28] disabled:bg-[#f1e2d7] disabled:text-[#8b7367]"
      >
        保存
      </button>
    </form>
  );
}
