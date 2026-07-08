"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Plus, Settings } from "lucide-react";

const TABS = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/history", label: "履歴", icon: List },
  { href: "/settings", label: "設定", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const isAddPage = pathname?.startsWith("/add") ?? false;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-pink-100 shadow-[0_-8px_24px_rgba(244,114,182,0.12)] backdrop-blur z-30"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="ボトムナビゲーション"
    >
      <div className="mx-auto max-w-md flex items-center justify-around relative h-16">
        <NavItem tab={TABS[0]} active={pathname === "/"} />
        <NavItem tab={TABS[1]} active={pathname?.startsWith("/history") ?? false} />
        {/* Center FAB */}
        <Link
          href="/add"
          className="absolute left-1/2 -top-5 -translate-x-1/2 tap-target w-14 h-14 rounded-full bg-pink-500 text-white shadow-lg shadow-pink-200/80 active:bg-pink-600 flex items-center justify-center"
          aria-label="登録"
        >
          <Plus size={28} strokeWidth={2.5} />
        </Link>
        <div className="w-14" />
        <NavItem
          tab={TABS[2]}
          active={pathname?.startsWith("/settings") ?? false}
        />
      </div>
      {isAddPage && (
        <span className="sr-only">登録画面表示中</span>
      )}
    </nav>
  );
}

function NavItem({
  tab,
  active,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
}) {
  const Icon = tab.icon;
  return (
    <Link
      href={tab.href}
      className={`tap-target flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] ${
        active ? "text-pink-600" : "text-stone-500"
      }`}
    >
      <Icon size={22} />
      <span>{tab.label}</span>
    </Link>
  );
}
