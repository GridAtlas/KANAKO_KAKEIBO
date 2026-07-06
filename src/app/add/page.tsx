"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TransactionForm } from "@/components/TransactionForm";

export default function AddPage() {
  return (
    <>
      <header className="sticky top-0 bg-white border-b border-slate-200 px-3 py-3 flex items-center gap-2 z-20">
        <Link
          href="/"
          className="tap-target -ml-1 p-1 text-slate-500"
          aria-label="戻る"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="font-semibold text-slate-700">登録</h1>
      </header>
      <TransactionForm />
    </>
  );
}
