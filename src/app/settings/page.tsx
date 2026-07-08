"use client";

import Link from "next/link";
import { ChevronRight, Repeat, Tags, Info } from "lucide-react";

export default function SettingsPage() {
  const items = [
    {
      href: "/settings/categories",
      icon: Tags,
      label: "カテゴリ管理",
      desc: "追加・編集・並び替え",
    },
    {
      href: "/settings/fixed",
      icon: Repeat,
      label: "固定費の設定",
      desc: "毎月自動計上する項目",
    },
  ];

  return (
    <div className="flex-1 p-3 space-y-3">
      <header className="py-1">
        <h1 className="font-semibold text-stone-700 px-1">設定</h1>
      </header>

      <div className="rounded-2xl bg-white/90 border border-pink-100 overflow-hidden divide-y divide-pink-50">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center gap-3 px-3 py-3 active:bg-pink-50"
            >
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-stone-600">
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-stone-800">{it.label}</div>
                <div className="text-xs text-stone-500">{it.desc}</div>
              </div>
              <ChevronRight size={18} className="text-stone-400" />
            </Link>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-pink-50 border border-pink-100 p-3 text-xs text-stone-600 flex items-start gap-2">
        <Info size={16} className="text-stone-500 mt-0.5" />
        <p>
          データはこの端末の localStorage に保存されます。ブラウザを消したり
          プライベートモードで開くとデータが失われる可能性があります。Phase 3
          でクラウド同期に対応予定です。
        </p>
      </div>
    </div>
  );
}
