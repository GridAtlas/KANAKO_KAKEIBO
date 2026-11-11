"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TransactionForm } from "@/components/TransactionForm";

export default function AddPage() {
  return (
    <main className="compact-page w-full px-3 pb-2 pt-2 sm:px-5">
      <header className="flex min-h-12 items-center gap-1 border-b border-[#eadccf]">
        <Link
          href="/today"
          className="tap-target -ml-1 inline-flex items-center justify-center rounded-lg text-[#983e34] hover:bg-[#faf2ea]"
          aria-label="戻る"
        >
          <ArrowLeft size={21} aria-hidden="true" />
        </Link>
        <h1 className="text-lg font-bold text-[#3b2721]">取引を登録</h1>
      </header>
      <TransactionForm />
    </main>
  );
}
