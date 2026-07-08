"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TransactionForm } from "@/components/TransactionForm";

export default function AddPage() {
  return (
    <>
      <header className="sticky top-0 bg-white/90 border-b border-pink-100 px-3 py-3 flex items-center gap-2 z-20">
        <Link
          href="/"
          className="tap-target -ml-1 p-1 text-stone-500"
          aria-label="戻る"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-stone-700">登録</h1>
      </header>
      <TransactionForm />
    </>
  );
}
