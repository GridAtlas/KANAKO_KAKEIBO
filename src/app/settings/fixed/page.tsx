"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { getIcon } from "@/lib/icons";
import { FixedCostForm } from "@/components/FixedCostForm";
import { formatYen } from "@/lib/money";
import type { FixedCost } from "@/types";

export default function FixedPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const fixedCosts = useBudgetStore((s) => s.fixedCosts);
  const removeFixedCost = useBudgetStore((s) => s.removeFixedCost);
  const getCategoryById = useBudgetStore((s) => s.getCategoryById);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FixedCost | null>(null);

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
        <h1 className="font-semibold text-slate-700">固定費の設定</h1>
      </header>

      {!hydrated ? (
        <div className="text-center text-sm text-slate-400 py-6">読み込み中…</div>
      ) : showForm || editing ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-3">
          <FixedCostForm
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
          <span>固定費を追加</span>
        </button>
      )}

      {fixedCosts.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 text-center text-sm text-slate-400">
          まだ固定費はありません
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {fixedCosts.map((f) => {
            const cat = getCategoryById(f.categoryId);
            const Icon = getIcon(cat?.icon ?? "HelpCircle");
            const color = cat?.color ?? "slate";
            return (
              <div key={f.id} className="flex items-center gap-3 px-3 py-2.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-${color}-100 text-${color}-700 ${
                    !f.active ? "opacity-40" : ""
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate">
                      {f.label || cat?.name || "—"}
                    </span>
                    {!f.active && (
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-1 rounded">
                        停止
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {cat?.name ?? "削除済カテゴリ"} · 毎月 {f.paymentDay} 日
                  </div>
                </div>
                <div className="num font-bold text-slate-900">
                  {formatYen(f.amount)}
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(f)}
                  className="tap-target p-1 text-slate-500"
                  aria-label="編集"
                >
                  <Pencil size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("この固定費設定を削除しますか？")) {
                      removeFixedCost(f.id);
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
      )}
    </div>
  );
}
