"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Target } from "lucide-react";
import { getDailyBudgetStatus } from "@/lib/dailyBudget";
import { useDailyBudget } from "@/lib/useDailyBudget";
import { useBudgetStore } from "@/store/useBudgetStore";

export default function DailyBudgetSettingsPage() {
  const { today, goals, spending } = useDailyBudget();

  return (
    <main className="compact-page flex-1 px-3 py-2 sm:p-5">
      <Link href="/settings" className="tap-target inline-flex items-center gap-1.5 rounded-lg text-sm font-bold text-[var(--accent)] hover:underline">
        <ArrowLeft size={17} aria-hidden="true" />
        設定へ
      </Link>
      <section className="mt-2 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <h1 className="flex items-center gap-2 text-xl font-bold text-[var(--ink)]">
          <Target size={21} className="text-[var(--accent)]" aria-hidden="true" />
          1日の支出目標
        </h1>
        <p id="goal-help" className="mb-3 mt-2 text-sm leading-relaxed text-[var(--muted)]">
          固定費を除いた支出の目標です。今日から適用します。
        </p>
        {today ? (
          <DailyBudgetForm currentGoal={getDailyBudgetStatus(today, today, goals, spending).goal} />
        ) : (
          <p className="text-sm text-[var(--muted)]" role="status">読み込み中…</p>
        )}
      </section>
    </main>
  );
}

function DailyBudgetForm({ currentGoal }: { currentGoal: number | null }) {
  const [value, setValue] = useState(currentGoal === null ? "" : String(currentGoal));
  const [error, setError] = useState(false);
  const setGoal = useBudgetStore((state) => state.setDailyBudgetGoal);
  const router = useRouter();

  function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = value.normalize("NFKC").trim();
    const amount = Number(normalized);
    if (!/^\d+$/.test(normalized) || !Number.isSafeInteger(amount)) {
      setError(true);
      return;
    }
    setGoal(amount);
    router.push("/today");
  }

  return (
    <form onSubmit={saveGoal} noValidate>
      <label htmlFor="daily-goal" className="text-sm font-bold text-[var(--ink)]">1日に使える金額</label>
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#d7bdc6] bg-[var(--surface)] px-3 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]">
        <input
          id="daily-goal"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          required
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(false);
          }}
          placeholder="例 2000"
          aria-describedby={error ? "goal-help goal-error" : "goal-help"}
          aria-invalid={error}
          className="min-h-12 min-w-0 flex-1 bg-transparent font-semibold tabular-nums text-[var(--ink)] outline-none placeholder:font-normal placeholder:text-[#806b6e]"
        />
        <span className="text-sm font-bold text-[var(--muted)]">円</span>
      </div>
      {error && <p id="goal-error" role="alert" className="mt-2 text-sm font-semibold text-[var(--accent)]">0円以上の整数を入力してください。</p>}
      <button type="submit" className="tap-target mt-4 w-full rounded-xl bg-[var(--accent)] px-4 text-sm font-bold text-white hover:bg-[var(--accent-hover)]">
        今日からこの目標にする
      </button>
    </form>
  );
}
