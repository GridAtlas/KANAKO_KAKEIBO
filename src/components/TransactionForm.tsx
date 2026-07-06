"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { CategoryPicker } from "./CategoryPicker";
import { todayLocal } from "@/lib/date";
import { formatYenNoSign, parseYenInput } from "@/lib/money";
import type { CategoryType } from "@/types";

export function TransactionForm() {
  const router = useRouter();
  const addTransaction = useBudgetStore((s) => s.addTransaction);

  const [type, setType] = useState<CategoryType>("expense");
  const [amountStr, setAmountStr] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [date, setDate] = useState<string>(todayLocal());
  const [memo, setMemo] = useState<string>("");

  const amount = parseYenInput(amountStr);
  const canSubmit = amount > 0 && !!categoryId && !!date;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    addTransaction({
      categoryId,
      amount,
      date,
      memo: memo.trim() || undefined,
    });
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 space-y-4 pb-32">
      {/* 支出 / 収入 タブ */}
      <div className="flex bg-slate-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => {
            setType("expense");
            setCategoryId("");
          }}
          className={`tap-target flex-1 rounded-md py-2 font-semibold ${
            type === "expense" ? "bg-white text-rose-600 shadow" : "text-slate-500"
          }`}
        >
          支出
        </button>
        <button
          type="button"
          onClick={() => {
            setType("income");
            setCategoryId("");
          }}
          className={`tap-target flex-1 rounded-md py-2 font-semibold ${
            type === "income"
              ? "bg-white text-emerald-600 shadow"
              : "text-slate-500"
          }`}
        >
          収入
        </button>
      </div>

      {/* 金額 */}
      <div>
        <label className="block text-xs text-slate-500 mb-1">金額</label>
        <div className="flex items-center rounded-xl bg-white border border-slate-200 px-4 py-3">
          <span className="text-2xl font-bold text-slate-400 mr-2">¥</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={amountStr === "" ? "" : formatYenNoSign(amount)}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="0"
            className="num flex-1 outline-none text-2xl font-bold bg-transparent"
          />
        </div>
      </div>

      {/* カテゴリ */}
      <div>
        <label className="block text-xs text-slate-500 mb-2">カテゴリ</label>
        <CategoryPicker
          selectedId={categoryId}
          onSelect={setCategoryId}
          filterType={type}
        />
      </div>

      {/* 日付 */}
      <div>
        <label className="block text-xs text-slate-500 mb-1">日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 outline-none"
        />
      </div>

      {/* メモ */}
      <div>
        <label className="block text-xs text-slate-500 mb-1">メモ（任意）</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="例: スーパー"
          className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 outline-none"
        />
      </div>

      {/* レシート撮影（Phase 3、現状は disabled） */}
      <button
        type="button"
        disabled
        className="tap-target w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-400 py-3 border border-dashed border-slate-300 cursor-not-allowed"
      >
        <Camera size={18} />
        <span>レシートを撮る（近日対応 / Phase 3）</span>
      </button>

      {/* 保存 */}
      <div className="fixed left-0 right-0 bottom-16 px-3 z-20">
        <div className="mx-auto max-w-md">
          <button
            type="submit"
            disabled={!canSubmit}
            className="tap-target w-full inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-white py-3 font-bold shadow-lg active:bg-emerald-700 disabled:opacity-40"
          >
            保存
          </button>
        </div>
      </div>
    </form>
  );
}
