"use client";

import Image from "next/image";
import {
  ArrowLeft, Check, ChevronLeft, ChevronRight, History, Pencil, PiggyBank, Plus, Sparkles,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { BudgetPageHeader } from "@/components/BudgetPageHeader";
import { Modal } from "@/components/Modal";
import { dateToLocalString, formatDateShort } from "@/lib/date";
import { formatYen } from "@/lib/money";
import { getOutfitImage, type OutfitId } from "@/lib/wardrobe";
import { useBudgetStore } from "@/store/useBudgetStore";
import type { SavingsContribution, SavingsGoal } from "@/types";

const goalsPerPage = 4;
const entriesPerPage = 5;
const primaryButton = "tap-target inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 text-sm font-bold text-white hover:bg-[var(--accent-hover)]";
const secondaryButton = "tap-target inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--accent)] hover:bg-[#fcf1f4]";
const field = "min-h-11 min-w-0 w-full rounded-xl border border-[#dfc8ce] bg-white px-3 text-base text-[var(--ink)]";

type SavingsView =
  | { kind: "list" }
  | { kind: "new" }
  | { kind: "detail" | "edit" | "history"; goalId: string };

function savedAmount(goal: SavingsGoal): number {
  return goal.contributions.reduce((sum, { amount }) => sum + amount, 0);
}

function positiveYen(input: string): number | undefined {
  const normalized = input.normalize("NFKC").trim();
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(normalized)) return undefined;
  const amount = Number(normalized.replace(/,/g, ""));
  return amount > 0 && Number.isSafeInteger(amount) ? amount : undefined;
}

export default function SavingsPage() {
  const goals = useBudgetStore((state) => state.savingsGoals);
  const activeOutfit = useBudgetStore((state) => state.debugOutfit ?? state.activeOutfit);
  const addGoal = useBudgetStore((state) => state.addSavingsGoal);
  const updateGoal = useBudgetStore((state) => state.updateSavingsGoal);
  const removeGoal = useBudgetStore((state) => state.removeSavingsGoal);
  const addContribution = useBudgetStore((state) => state.addSavingsContribution);
  const removeContribution = useBudgetStore((state) => state.removeSavingsContribution);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<SavingsView>({ kind: "list" });
  const [requestedPage, setRequestedPage] = useState(0);
  const [celebratedGoal, setCelebratedGoal] = useState<SavingsGoal>();
  useEffect(() => setReady(true), []);

  const activeGoal = "goalId" in view ? goals.find(({ id }) => id === view.goalId) : undefined;
  const detail = (goalId: string) => setView({ kind: "detail", goalId });
  const history = (goalId: string) => setView({ kind: "history", goalId });

  function returnToList() {
    const index = activeGoal ? goals.findIndex(({ id }) => id === activeGoal.id) : -1;
    if (index >= 0) setRequestedPage(Math.floor(index / goalsPerPage));
    setView({ kind: "list" });
  }

  function celebrateWhenReached(previous: SavingsGoal, next: SavingsGoal) {
    if (savedAmount(previous) < previous.targetAmount && savedAmount(next) >= next.targetAmount) {
      setCelebratedGoal(next);
    }
  }

  function readGoal(id: string) {
    return useBudgetStore.getState().savingsGoals.find((goal) => goal.id === id);
  }

  function submitGoal(input: Pick<SavingsGoal, "name" | "targetAmount">): boolean {
    if (view.kind === "edit" && activeGoal) {
      updateGoal(activeGoal.id, input);
      const updated = readGoal(activeGoal.id);
      if (!updated || updated.name !== input.name || updated.targetAmount !== input.targetAmount) return false;
      celebrateWhenReached(activeGoal, updated);
      detail(updated.id);
      return true;
    }
    const created = addGoal(input);
    if (!created) return false;
    detail(created.id);
    return true;
  }

  function recordContribution(goalId: string, amount: number): boolean {
    const goal = readGoal(goalId);
    if (!goal) return false;
    addContribution(goalId, amount);
    const updated = readGoal(goalId);
    if (!updated || updated.contributions.length === goal.contributions.length) return false;
    celebrateWhenReached(goal, updated);
    return true;
  }

  const title = view.kind === "new" ? "目標を追加"
    : !activeGoal ? "貯金目標"
      : view.kind === "edit" ? "目標を編集"
        : view.kind === "history" ? "積立履歴"
          : activeGoal.name;
  const showList = view.kind !== "new" && !activeGoal;

  return (
    <main className="wide-page compact-page w-full px-3 pb-2 pt-2 sm:px-6 md:pt-4">
      <BudgetPageHeader />
      <div className="mx-auto mt-1 max-w-lg">
        <header className="flex min-h-12 items-center justify-between gap-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            {showList ? (
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#e8f0e7] text-[var(--sage)]">
                <PiggyBank size={18} strokeWidth={1.75} />
              </span>
            ) : (
              <button
                type="button"
                aria-label={activeGoal && view.kind !== "detail" ? "目標へ戻る" : "目標一覧へ戻る"}
                onClick={() => {
                  if (activeGoal && view.kind !== "detail") detail(activeGoal.id);
                  else returnToList();
                }}
                className="tap-target grid shrink-0 place-items-center rounded-lg text-[var(--accent)] hover:bg-[#fcf1f4]"
              >
                <ArrowLeft size={19} aria-hidden="true" />
              </button>
            )}
            <h1 className="truncate text-lg font-bold tracking-tight text-[var(--ink)] sm:text-xl" title={title}>{title}</h1>
          </div>
          {ready && showList && (
            <button type="button" onClick={() => setView({ kind: "new" })} className={`${primaryButton} shrink-0`}>
              <Plus size={16} aria-hidden="true" />
              目標を追加
            </button>
          )}
        </header>
        {!ready ? (
          <p role="status" className="text-sm text-[var(--muted)]">読み込み中…</p>
        ) : showList ? (
          <GoalList goals={goals} requestedPage={requestedPage} onPageChange={setRequestedPage} onOpen={detail} />
        ) : view.kind === "new" || (view.kind === "edit" && activeGoal) ? (
          <GoalForm
            key={activeGoal?.id ?? "new"}
            goal={activeGoal}
            onSave={submitGoal}
            onDelete={activeGoal && (() => {
              if (window.confirm("この目標と積立記録を削除しますか？")) {
                removeGoal(activeGoal.id);
                returnToList();
              }
            })}
          />
        ) : view.kind === "detail" && activeGoal ? (
          <GoalDetail
            key={activeGoal.id}
            goal={activeGoal}
            onRecord={(amount) => recordContribution(activeGoal.id, amount)}
            onEdit={() => setView({ kind: "edit", goalId: activeGoal.id })}
            onHistory={() => history(activeGoal.id)}
          />
        ) : activeGoal && (
          <ContributionHistory
            key={activeGoal.id}
            goal={activeGoal}
            onDelete={(entry) => {
              if (window.confirm("この積立記録を削除しますか？")) removeContribution(activeGoal.id, entry.id);
            }}
          />
        )}
      </div>
      {celebratedGoal && (
        <Celebration goal={celebratedGoal} outfit={activeOutfit} onClose={() => setCelebratedGoal(undefined)} />
      )}
    </main>
  );
}

function GoalList({ goals, requestedPage, onPageChange, onOpen }: {
  goals: readonly SavingsGoal[];
  requestedPage: number;
  onPageChange: (page: number) => void;
  onOpen: (id: string) => void;
}) {
  if (goals.length === 0) {
    return (
      <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-5">
        <p className="text-sm font-bold">貯金目標はまだありません。</p>
        <p className="mt-1 text-xs text-[var(--muted)]">旅行や買い物など、目的ごとに目標を作れます。</p>
      </div>
    );
  }

  const pages = Math.ceil(goals.length / goalsPerPage);
  const page = Math.min(requestedPage, pages - 1);
  const visible = goals.slice(page * goalsPerPage, (page + 1) * goalsPerPage);

  return (
    <>
      <ul className="divide-y divide-[var(--line)] overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--surface)]" aria-label="貯金目標">
        {visible.map((goal) => {
          const saved = savedAmount(goal);
          return (
            <li key={goal.id}>
              <button type="button" onClick={() => onOpen(goal.id)} className="tap-target flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-[#fcf1f4]">
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-bold">{goal.name}</span>
                    {saved >= goal.targetAmount && <Achieved />}
                  </span>
                  <span className="mt-0.5 block break-words text-xs tabular-nums text-[var(--muted)]">
                    {formatYen(saved)} / {formatYen(goal.targetAmount)}
                  </span>
                  <GoalProgress saved={saved} target={goal.targetAmount} decorative />
                </span>
                <ChevronRight size={17} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <SavingsPager label="貯金目標のページ" page={page} pages={pages} onChange={onPageChange} />
    </>
  );
}

function GoalDetail({ goal, onRecord, onEdit, onHistory }: {
  goal: SavingsGoal;
  onRecord: (amount: number) => boolean;
  onEdit: () => void;
  onHistory: () => void;
}) {
  const [amountInput, setAmountInput] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const saved = savedAmount(goal);
  const remaining = Math.max(0, goal.targetAmount - saved);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const amount = positiveYen(amountInput);
    if (!amount) {
      setError("1円以上の整数を入力してください。");
      return;
    }
    if (!onRecord(amount)) {
      setError("金額を確認して、もう一度お試しください。");
      return;
    }
    setAmountInput("");
    setError("");
    setStatus(`${formatYen(amount)}を積み立てました。`);
  }

  return (
    <>
      <section aria-label="貯金の進み具合" className="rounded-[20px] border border-[#d9e3d7] bg-[linear-gradient(155deg,#edf4eb_0%,var(--surface)_68%)] px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[var(--sage)]">貯まった金額</h2>
          {remaining === 0 && <Achieved />}
        </div>
        <p className="mt-0.5 break-words text-[clamp(1.65rem,7vw,2.2rem)] font-extrabold leading-tight tracking-tight tabular-nums">{formatYen(saved)}</p>
        <GoalProgress saved={saved} target={goal.targetAmount} />
        <dl className="mt-1 flex flex-wrap justify-between gap-x-3 text-xs tabular-nums text-[var(--muted)]">
          <div className="flex items-baseline gap-1"><dt>目標</dt><dd className="font-bold">{formatYen(goal.targetAmount)}</dd></div>
          <div className="flex items-baseline gap-1"><dt>あと</dt><dd className="font-bold">{formatYen(remaining)}</dd></div>
        </dl>
      </section>
      <form onSubmit={submit} noValidate className="mt-2 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-3">
        <label htmlFor="savings-contribution" className="text-xs font-bold">積立金額</label>
        <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] gap-1.5">
          <input
            id="savings-contribution"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={amountInput}
            onChange={(event) => { setAmountInput(event.target.value); setError(""); setStatus(""); }}
            placeholder="例 1000"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "savings-contribution-error" : "savings-contribution-help"}
            className={`${field} tabular-nums`}
          />
          <button type="submit" className={primaryButton}>積み立てる</button>
        </div>
        {error ? (
          <p id="savings-contribution-error" role="alert" className="mt-1.5 text-xs font-semibold text-[var(--accent)]">{error}</p>
        ) : (
          <p id="savings-contribution-help" role="status" className="mt-1.5 text-xs text-[var(--muted)]">
            {status || "家計簿の収支とは別に記録します。"}
          </p>
        )}
      </form>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button type="button" onClick={onHistory} className={secondaryButton}><History size={15} aria-hidden="true" />積立履歴</button>
        <button type="button" onClick={onEdit} className={secondaryButton}><Pencil size={15} aria-hidden="true" />目標を編集</button>
      </div>
    </>
  );
}

function GoalForm({ goal, onSave, onDelete }: {
  goal?: SavingsGoal;
  onSave: (input: Pick<SavingsGoal, "name" | "targetAmount">) => boolean;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(goal?.name ?? "");
  const [targetInput, setTargetInput] = useState(goal ? String(goal.targetAmount) : "");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = name.trim();
    const targetAmount = positiveYen(targetInput);
    if (!title || !targetAmount) {
      setError("目標の名前と1円以上の目標金額を入力してください。");
      return;
    }
    if (!onSave({ name: title, targetAmount })) setError("入力内容を確認して、もう一度お試しください。");
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-2 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-3.5">
      <label className="block text-sm font-bold">
        目標の名前
        <input
          type="text"
          value={name}
          onChange={(event) => { setName(event.target.value); setError(""); }}
          placeholder="例 旅行"
          className={`${field} mt-1 font-normal`}
        />
      </label>
      <label className="block text-sm font-bold">
        目標金額（円）
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={targetInput}
          onChange={(event) => { setTargetInput(event.target.value); setError(""); }}
          placeholder="例 50000"
          className={`${field} mt-1 font-normal tabular-nums`}
        />
      </label>
      {error && <p role="alert" className="text-xs font-semibold text-[var(--accent)]">{error}</p>}
      <button type="submit" className={`${primaryButton} w-full`}>{goal ? "変更を保存" : "目標を作る"}</button>
      {onDelete && (
        <button type="button" onClick={onDelete} className={`${secondaryButton} w-full`}>目標を削除</button>
      )}
    </form>
  );
}

function ContributionHistory({ goal, onDelete }: {
  goal: SavingsGoal;
  onDelete: (entry: SavingsContribution) => void;
}) {
  const [requestedPage, setRequestedPage] = useState(0);
  const pages = Math.max(1, Math.ceil(goal.contributions.length / entriesPerPage));
  const page = Math.min(requestedPage, pages - 1);
  const entries = [...goal.contributions].sort((a, b) => b.createdAt - a.createdAt)
    .slice(page * entriesPerPage, (page + 1) * entriesPerPage);

  return (
    <>
      <p className="mb-1.5 truncate px-1 text-sm font-bold text-[var(--muted)]">{goal.name}</p>
      {entries.length ? (
        <ul className="divide-y divide-[var(--line)] rounded-[20px] border border-[var(--line)] bg-[var(--surface)]">
          {entries.map((entry) => (
            <li key={entry.id} className="flex min-w-0 items-center gap-1 pl-3 pr-1">
              <span className="flex-1 text-xs text-[var(--muted)]">{formatDateShort(dateToLocalString(new Date(entry.createdAt)))}</span>
              <span className="max-w-[47%] break-all text-right text-sm font-bold tabular-nums">{formatYen(entry.amount)}</span>
              <button type="button" onClick={() => onDelete(entry)} className="tap-target shrink-0 rounded-lg text-xs font-bold text-[var(--accent)] hover:bg-[#fcf1f4]" aria-label={`${formatYen(entry.amount)}の積立を削除`}>
                削除
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">積立記録はまだありません。</p>
      )}
      <SavingsPager label="積立履歴のページ" page={page} pages={pages} onChange={setRequestedPage} />
    </>
  );
}

function GoalProgress({ saved, target, decorative = false }: { saved: number; target: number; decorative?: boolean }) {
  const progress = Math.min(saved / target, 1) * 100;
  return (
    <span
      role={decorative ? undefined : "progressbar"}
      aria-label={decorative ? undefined : "目標の達成率"}
      aria-valuenow={decorative ? undefined : Math.round(progress)}
      aria-valuetext={decorative ? undefined : `${formatYen(target)}のうち${formatYen(saved)}`}
      aria-hidden={decorative || undefined}
      className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[#e4ece1]"
    >
      <span className="block h-full rounded-full bg-[var(--sage)]" style={{ width: `${progress}%` }} />
    </span>
  );
}

function Achieved() {
  return (
    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#e5eee3] px-1.5 py-0.5 text-[11px] font-bold text-[var(--sage)]">
      <Check size={12} aria-hidden="true" />達成
    </span>
  );
}

function SavingsPager({ label, page, pages, onChange }: {
  label: string;
  page: number;
  pages: number;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) return null;
  const arrow = "tap-target grid place-items-center rounded-lg text-[var(--accent)] enabled:hover:bg-[#fcf1f4] disabled:opacity-35";
  return (
    <nav aria-label={label} className="mt-1 flex items-center justify-center gap-2 text-[var(--muted)]">
      <button type="button" aria-label="前のページ" disabled={page === 0} onClick={() => onChange(page - 1)} className={arrow}><ChevronLeft size={19} aria-hidden="true" /></button>
      <span aria-live="polite" className="min-w-12 text-center text-xs font-bold tabular-nums">{page + 1} / {pages}</span>
      <button type="button" aria-label="次のページ" disabled={page === pages - 1} onClick={() => onChange(page + 1)} className={arrow}><ChevronRight size={19} aria-hidden="true" /></button>
    </nav>
  );
}

function Celebration({ goal, outfit, onClose }: { goal: SavingsGoal; outfit: OutfitId; onClose: () => void }) {
  return (
    <Modal labelledBy="savings-celebration-title" describedBy="savings-celebration-goal" onClose={onClose} className="rounded-[24px] bg-[linear-gradient(155deg,#fae7ed_0%,var(--surface)_65%)] p-4 text-center">
      <div className="relative mx-auto size-36">
        <span className="absolute inset-3 rounded-full border border-white bg-white/45" aria-hidden="true" />
        <Sparkles className="absolute right-1 top-3 text-[var(--gold)]" size={22} aria-hidden="true" />
        <Image src={getOutfitImage(outfit, 2)} alt="お祝いするミニかなこ" fill sizes="144px" className="object-contain" />
      </div>
      <h2 id="savings-celebration-title" className="text-xl font-extrabold text-[var(--accent)]">貯金目標を達成！</h2>
      <p id="savings-celebration-goal" className="mt-1 break-words text-sm font-bold">{goal.name} · {formatYen(goal.targetAmount)}</p>
      <button type="button" onClick={onClose} className={`${primaryButton} mt-3 w-full`}>閉じる</button>
    </Modal>
  );
}
