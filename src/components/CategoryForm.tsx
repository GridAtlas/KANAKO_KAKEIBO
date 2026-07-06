"use client";

import { useState } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import {
  AVAILABLE_COLORS,
  AVAILABLE_ICONS,
} from "@/lib/constants";
import { getIcon } from "@/lib/icons";
import type { Category, CategoryType } from "@/types";

interface Props {
  initial?: Category;
  onSubmit: () => void;
  onCancel: () => void;
}

export function CategoryForm({ initial, onSubmit, onCancel }: Props) {
  const addCategory = useBudgetStore((s) => s.addCategory);
  const updateCategory = useBudgetStore((s) => s.updateCategory);

  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState<string>(initial?.icon ?? "MoreHorizontal");
  const [color, setColor] = useState<string>(initial?.color ?? "slate");
  const [type, setType] = useState<CategoryType>(initial?.type ?? "expense");
  const [isFixedCost, setIsFixedCost] = useState<boolean>(
    initial?.isFixedCost ?? false,
  );

  const canSubmit = name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (initial) {
      updateCategory(initial.id, { name: name.trim(), icon, color, type, isFixedCost });
    } else {
      addCategory({ name: name.trim(), icon, color, type, isFixedCost });
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-slate-500 mb-1">名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: サウナ代"
          className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">種別</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`tap-target flex-1 rounded-lg py-2 font-semibold ${
              type === "expense"
                ? "bg-rose-100 text-rose-700 border border-rose-200"
                : "bg-white text-slate-500 border border-slate-200"
            }`}
          >
            支出
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`tap-target flex-1 rounded-lg py-2 font-semibold ${
              type === "income"
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-white text-slate-500 border border-slate-200"
            }`}
          >
            収入
          </button>
        </div>
      </div>

      {type === "expense" && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isFixedCost}
            onChange={(e) => setIsFixedCost(e.target.checked)}
            className="w-5 h-5 accent-amber-500"
          />
          <span>固定費カテゴリ（毎月の支出に含まれる）</span>
        </label>
      )}

      <div>
        <label className="block text-xs text-slate-500 mb-1">色</label>
        <div className="grid grid-cols-6 gap-2">
          {AVAILABLE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`tap-target rounded-full bg-${c}-500 h-9 w-9 border-2 ${
                color === c ? "border-slate-900" : "border-transparent"
              }`}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">アイコン</label>
        <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
          {AVAILABLE_ICONS.map((name) => {
            const Icon = getIcon(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => setIcon(name)}
                className={`tap-target rounded-lg h-11 flex items-center justify-center border ${
                  icon === name
                    ? `bg-${color}-100 border-${color}-300`
                    : "bg-white border-slate-200"
                }`}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </div>

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
