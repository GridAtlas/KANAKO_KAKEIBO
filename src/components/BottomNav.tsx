"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Plus, Settings } from "lucide-react";

const TABS = [
  { href: "/today", label: "ホーム", icon: Home },
  { href: "/history", label: "履歴", icon: List },
  { href: "/settings", label: "設定", icon: Settings },
];
const HOME_ROUTES = ["/", "/today", "/calendar", "/dashboard", "/trends", "/wardrobe", "/weekly", "/savings"];

export function BottomNav() {
  const pathname = usePathname()?.replace(/\/$/, "") || "/";
  const isAddPage = pathname === "/add";
  const isEditPage = pathname === "/history/edit";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[#fffcf8]/95 shadow-[0_-4px_18px_rgba(79,39,49,0.055)] backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="ボトムナビゲーション"
    >
      <div className="relative mx-auto grid h-16 max-w-md grid-cols-[1fr_1fr_62px_2fr] items-center">
        <NavItem tab={TABS[0]} active={HOME_ROUTES.includes(pathname)} />
        <NavItem tab={TABS[1]} active={pathname === "/history" || isEditPage} />
        <div aria-hidden="true" />
        {!isAddPage && !isEditPage && (
          <Link
            href="/add"
            className="tap-target absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[15px] bg-[var(--accent)] text-white shadow-[0_4px_9px_rgba(165,60,85,0.24)] hover:bg-[var(--accent-hover)]"
            aria-label="登録"
          >
            <Plus size={27} strokeWidth={2} aria-hidden="true" />
          </Link>
        )}
        <NavItem
          tab={TABS[2]}
          active={pathname.startsWith("/settings")}
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
        active ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--accent)]"
      }`}
    >
      <span className={`grid h-7 w-10 place-items-center rounded-full ${active ? "bg-[#f9e5eb]" : ""}`}>
        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span>{tab.label}</span>
    </Link>
  );
}
