"use client";

import { useState, type FormEvent } from "react";
import { useBudgetStore } from "@/store/useBudgetStore";
import { AVAILABLE_COLORS, AVAILABLE_ICONS } from "@/lib/constants";
import { getIcon } from "@/lib/icons";
import type { Category, CategoryType } from "@/types";

const colorLabels: Record<(typeof AVAILABLE_COLORS)[number], string> = {
  rose: "ローズ", red: "赤", orange: "オレンジ", amber: "琥珀", yellow: "黄色",
  lime: "黄緑", green: "緑", emerald: "エメラルド", teal: "青緑",
  cyan: "シアン", sky: "空色", blue: "青", indigo: "藍色",
  violet: "すみれ", purple: "紫", fuchsia: "赤紫", pink: "ピンク", slate: "グレー",
};

const iconLabels: Record<(typeof AVAILABLE_ICONS)[number], string> = {
  Utensils: "食事", Home: "家", Zap: "電気", Wifi: "通信", RefreshCcw: "定期購入",
  Car: "車", ShoppingBag: "買い物", Stethoscope: "医療", Gamepad2: "ゲーム", Users: "交際",
  Wallet: "財布", TrendingUp: "グラフ", MoreHorizontal: "その他", Coffee: "コーヒー",
  Beer: "ビール", Music: "音楽", Film: "映画", Book: "本", GraduationCap: "学び",
  Baby: "育児", PawPrint: "ペット", Shirt: "衣服", Scissors: "はさみ", Palette: "美術",
  Dumbbell: "運動", Bike: "自転車", Plane: "飛行機", Train: "電車", Bus: "バス",
  Fuel: "燃料", CreditCard: "カード", Gift: "贈り物", HandHeart: "支援",
  Sparkles: "きらめき", Waves: "波", Leaf: "葉", Flame: "火",
};

interface Props {
  initial?: Category;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const fieldClass = "min-h-11 w-full min-w-0 rounded-lg border border-[#eadccf] bg-white px-2 text-[#3b2721]";

export function CategoryForm({ initial, onSubmit, onCancel, onDelete }: Props) {
  const addCategory = useBudgetStore((s) => s.addCategory);
  const updateCategory = useBudgetStore((s) => s.updateCategory);

  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "MoreHorizontal");
  const [color, setColor] = useState(initial?.color ?? "slate");
  const [type, setType] = useState<CategoryType>(initial?.type ?? "expense");
  const [isFixedCost, setIsFixedCost] = useState(initial?.isFixedCost ?? false);
  const Icon = getIcon(icon);
  const canSubmit = name.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const fields = { name: name.trim(), icon, color, type, isFixedCost };
    if (initial) updateCategory(initial.id, fields);
    else addCategory(fields);
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-[#3b2721]">
      <label className="block text-xs font-bold">
        名称
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="例  趣味" className={`mt-1 ${fieldClass}`} />
      </label>
      <div role="group" aria-label="種別" className="grid grid-cols-2 gap-1 rounded-xl bg-[#f4e7dc] p-1">
        <button type="button" onClick={() => setType("expense")} aria-pressed={type === "expense"} className={`tap-target rounded-lg text-sm font-bold ${type === "expense" ? "bg-white text-rose-700" : "text-[#765b50]"}`}>
          支出
        </button>
        <button type="button" onClick={() => setType("income")} aria-pressed={type === "income"} className={`tap-target rounded-lg text-sm font-bold ${type === "income" ? "bg-white text-emerald-700" : "text-[#765b50]"}`}>
          収入
        </button>
      </div>
      {type === "expense" && (
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={isFixedCost} onChange={(event) => setIsFixedCost(event.target.checked)} className="h-5 w-5 accent-[#a13e34]" />
          固定費カテゴリ
        </label>
      )}
      <div className="grid grid-cols-[2rem_minmax(0,1fr)_minmax(0,1fr)] items-end gap-2">
        <span className={`mb-1.5 grid h-8 w-8 place-items-center rounded-lg bg-${color}-100 text-${color}-700`} aria-hidden="true">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <label htmlFor="category-color" className="block text-xs font-bold">色</label>
          <select id="category-color" value={color} onChange={(event) => setColor(event.target.value)} className={`mt-1 ${fieldClass}`}>
            {!AVAILABLE_COLORS.some((choice) => choice === color) && <option value={color}>{color}</option>}
            {AVAILABLE_COLORS.map((choice) => <option key={choice} value={choice}>{colorLabels[choice]}</option>)}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor="category-icon" className="block text-xs font-bold">アイコン</label>
          <select id="category-icon" value={icon} onChange={(event) => setIcon(event.target.value)} className={`mt-1 ${fieldClass}`}>
            {!AVAILABLE_ICONS.some((choice) => choice === icon) && <option value={icon}>{icon}</option>}
            {AVAILABLE_ICONS.map((choice) => <option key={choice} value={choice}>{iconLabels[choice]}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        {onDelete && <button type="button" onClick={onDelete} className="tap-target rounded-lg px-2 text-xs font-bold text-[#a13e34] hover:bg-[#faf2ea]">削除</button>}
        <button type="button" onClick={onCancel} className="tap-target flex-1 rounded-lg bg-[#f4e7dc] px-1 text-xs font-bold text-[#765b50]">戻る</button>
        <button type="submit" disabled={!canSubmit} className="tap-target flex-1 rounded-lg bg-[#a13e34] px-1 text-sm font-bold text-white disabled:opacity-40">
          {initial ? "更新" : "追加"}
        </button>
      </div>
    </form>
  );
}
