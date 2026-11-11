"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Plus, Settings } from "lucide-react";

const TABS = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/history", label: "履歴", icon: List },
  { href: "/settings", label: "設定", icon: Settings },
];
const HOME_ROUTES = ["/", "/calendar", "/dashboard", "/trends", "/wardrobe"];

export function BottomNav() {
  const pathname = usePathname();
  const isAddPage = pathname?.startsWith("/add") ?? false;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#eeded1] bg-[#fffdf8]/95 shadow-[0_-5px_25px_rgba(94,58,33,0.07)] backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="ボトムナビゲーション"
    >
      <div className="relative mx-auto grid h-16 max-w-md grid-cols-[1fr_1fr_62px_2fr] items-center">
        <NavItem tab={TABS[0]} active={HOME_ROUTES.includes(pathname ?? "")} />
        <NavItem tab={TABS[1]} active={pathname?.startsWith("/history") ?? false} />
        <div aria-hidden="true" />
        {!isAddPage && (
          <Link
            href="/add"
            className="tap-target absolute -top-3 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-2xl bg-[#a13e34] text-white shadow-lg shadow-[#a13e34]/25 transition-colors hover:bg-[#862e28]"
            aria-label="登録"
          >
            <Plus size={28} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        )}
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
      aria-current={active ? "page" : undefined}
      className={`tap-target flex flex-col items-center justify-center gap-0.5 whitespace-nowrap rounded-xl px-0.5 text-[10px] font-semibold sm:text-xs ${
        active ? "text-[#a13e34]" : "text-stone-600 hover:bg-[#f9efe6]"
      }`}
    >
      <Icon size={21} aria-hidden="true" />
      <span>{tab.label}</span>
    </Link>
  );
}
