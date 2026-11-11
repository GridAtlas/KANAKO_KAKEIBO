"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TransactionForm } from "@/components/TransactionForm";

export default function AddPage() {
  return (
    <main className="compact-page w-full px-3 pb-2 pt-2 sm:px-5">
      <header className="flex min-h-12 items-center gap-1 border-b border-[#ecd9dd]">
        <Link
          href="/today"
          className="tap-target -ml-1 inline-flex items-center justify-center rounded-lg text-[#a53c55] hover:bg-[#fbebef]"
          aria-label="戻る"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#f7dce4]" aria-hidden="true">
            <ArrowLeft size={18} strokeWidth={1.8} />
          </span>
        </Link>
        <h1 className="text-lg font-bold tracking-tight text-[#40262d]">取引を登録</h1>
      </header>
      <TransactionForm />
    </main>
  );
}
