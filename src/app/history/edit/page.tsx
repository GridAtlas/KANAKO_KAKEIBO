"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { TransactionForm } from "@/components/TransactionForm";
import { useBudgetStore } from "@/store/useBudgetStore";

function EditLoading() {
  return <p className="p-4 text-center text-sm text-[var(--muted)]">読み込み中…</p>;
}

export default function EditTransactionPage() {
  return (
    <Suspense fallback={<EditLoading />}>
      <EditTransaction />
    </Suspense>
  );
}

function EditTransaction() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const transaction = useBudgetStore((state) => state.transactions.find((item) => item.id === id));
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const returnParams = new URLSearchParams();
  for (const key of ["month", "date", "category", "page"]) {
    const value = searchParams.get(key);
    if (value) returnParams.set(key, value);
  }
  const query = returnParams.toString();
  const returnHref = query ? `/history?${query}` : "/history";

  if (!hydrated) return <EditLoading />;

  return (
    <main className="compact-page w-full px-3 pt-2 sm:px-5 sm:pb-2">
      <header className="flex min-h-12 items-center gap-1 border-b border-[var(--line)]">
        <Link
          href={returnHref}
          replace
          className="tap-target -ml-1 inline-flex items-center justify-center rounded-lg text-[var(--accent)] hover:bg-[#fbebef]"
          aria-label="履歴に戻る"
        >
          <span className="grid size-8 place-items-center rounded-[10px] bg-[var(--blush)]" aria-hidden="true">
            <ArrowLeft size={18} strokeWidth={1.8} />
          </span>
        </Link>
        <h1 className="text-lg font-bold tracking-tight text-[var(--ink)]">取引を編集</h1>
      </header>
      {transaction ? (
        <TransactionForm key={transaction.id} transaction={transaction} returnHref={returnHref} />
      ) : (
        <p className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
          取引が見つかりません。
        </p>
      )}
    </main>
  );
}
