"use client";

import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Category,
  CategoryInput,
  CategoryTotal,
  FixedCost,
  FixedCostInput,
  MonthlyTotals,
  SavingsContribution,
  SavingsGoal,
  SavingsGoalInput,
  Transaction,
  TransactionInput,
  TransactionPreset,
  TransactionPresetInput,
} from "@/types";
import { DEFAULT_CATEGORIES, STORAGE_KEY, STORAGE_VERSION } from "@/lib/constants";
import { getDailySpending, type DailyBudgetGoal } from "@/lib/dailyBudget";
import { currentMonthKey, monthKeyOf, todayLocal } from "@/lib/date";
import { fixedCostToTransactionInput } from "@/lib/fixedCosts";
import { DEFAULT_OUTFIT, getUnlockedOutfits, getWardrobeProgress, type OutfitId } from "@/lib/wardrobe";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function seedCategories(): Category[] {
  const now = Date.now();
  return DEFAULT_CATEGORIES.map((c, i) => ({
    ...c,
    id: uuid(),
    createdAt: now + i,
  }));
}

function isPositiveYen(amount: number): boolean {
  return Number.isSafeInteger(amount) && amount > 0;
}

interface BudgetStore {
  categories: Category[];
  transactions: Transaction[];
  transactionPresets: TransactionPreset[];
  fixedCosts: FixedCost[];
  savingsGoals: SavingsGoal[];
  selectedMonth: string;
  appliedFixedCostMonths: Record<string, string[]>;
  dailyBudgetGoals: DailyBudgetGoal[];
  unlockedOutfits: OutfitId[];
  activeOutfit: OutfitId;
  velvetEarnedDate?: string;
  debugOutfit: OutfitId | null;

  // Categories
  addCategory: (input: CategoryInput) => Category;
  updateCategory: (id: string, patch: Partial<CategoryInput>) => void;
  removeCategory: (id: string) => void;
  reorderCategories: (ids: string[]) => void;

  // Transactions
  addTransaction: (input: TransactionInput) => Transaction;
  updateTransaction: (id: string, patch: Partial<TransactionInput>) => void;
  removeTransaction: (id: string) => void;

  // Transaction presets
  addTransactionPreset: (input: TransactionPresetInput) => TransactionPreset | undefined;
  removeTransactionPreset: (id: string) => void;

  // Savings goals
  addSavingsGoal: (input: SavingsGoalInput) => SavingsGoal | undefined;
  updateSavingsGoal: (id: string, input: SavingsGoalInput) => void;
  removeSavingsGoal: (id: string) => void;
  addSavingsContribution: (goalId: string, amount: number) => void;
  removeSavingsContribution: (goalId: string, contributionId: string) => void;

  // FixedCosts
  addFixedCost: (input: FixedCostInput) => FixedCost;
  updateFixedCost: (id: string, patch: Partial<FixedCostInput>) => void;
  removeFixedCost: (id: string) => void;

  // Month
  setSelectedMonth: (monthKey: string) => void;

  // Daily budget
  setDailyBudgetGoal: (amount: number) => void;

  // Wardrobe
  updateWardrobe: (today: string, outfit?: OutfitId) => void;
  setDebugOutfit: (outfit: OutfitId | null) => void;

  // Fixed cost application
  applyFixedCostsForMonth: (monthKey: string) => number;

  // Selectors (recomputed each call)
  getMonthlyTransactions: (monthKey: string) => Transaction[];
  getMonthlyTotals: (monthKey: string) => MonthlyTotals;
  getMonthlyByCategory: (monthKey: string) => CategoryTotal[];
  getCategoryById: (id: string) => Category | undefined;
}

type PersistedBudgetState = Pick<
  BudgetStore,
  | "categories"
  | "transactions"
  | "transactionPresets"
  | "fixedCosts"
  | "savingsGoals"
  | "selectedMonth"
  | "appliedFixedCostMonths"
  | "dailyBudgetGoals"
  | "unlockedOutfits"
  | "activeOutfit"
  | "velvetEarnedDate"
>;

const initialWardrobe: Pick<PersistedBudgetState, "unlockedOutfits" | "activeOutfit"> = {
  unlockedOutfits: [DEFAULT_OUTFIT],
  activeOutfit: DEFAULT_OUTFIT,
};

type PresetsAndSavings = Pick<PersistedBudgetState, "transactionPresets" | "savingsGoals">;

const featureSnapshotKey = `${STORAGE_KEY}:v4-features`;
const initialPresetsAndSavings: PresetsAndSavings = {
  transactionPresets: [],
  savingsGoals: [],
};

function readFeatureSnapshot(): PresetsAndSavings {
  try {
    const stored = localStorage.getItem(featureSnapshotKey);
    if (!stored) return initialPresetsAndSavings;

    const snapshot = JSON.parse(stored) as Partial<PresetsAndSavings> | null;
    return {
      transactionPresets: Array.isArray(snapshot?.transactionPresets) ? snapshot.transactionPresets : [],
      savingsGoals: Array.isArray(snapshot?.savingsGoals) ? snapshot.savingsGoals : [],
    };
  } catch {
    return initialPresetsAndSavings;
  }
}

function writeFeatureSnapshot({ transactionPresets, savingsGoals }: PresetsAndSavings) {
  // 旧版が家計簿の保存を書き戻しても、新機能のデータだけは次回の移行で復元できる。
  try {
    localStorage.setItem(featureSnapshotKey, JSON.stringify({ transactionPresets, savingsGoals }));
  } catch {
    // 通常の保存は完了済み。追加のスナップショットは空き容量やストレージ設定に依存する。
  }
}

const createBudgetStore: StateCreator<BudgetStore, [], [["zustand/persist", PersistedBudgetState]]> =
  (setTransient, get, api) => persist<BudgetStore, [], [], PersistedBudgetState>(
    (set, get) => ({
      categories: seedCategories(),
      transactions: [],
      fixedCosts: [],
      selectedMonth: currentMonthKey(),
      appliedFixedCostMonths: {},
      dailyBudgetGoals: [],
      ...initialWardrobe,
      ...initialPresetsAndSavings,
      debugOutfit: null,

      addCategory: (input) => {
        const cat: Category = {
          ...input,
          id: uuid(),
          sortOrder:
            Math.max(0, ...get().categories.map((c) => c.sortOrder)) + 10,
          createdAt: Date.now(),
        };
        set((s) => ({ categories: [...s.categories, cat] }));
        return cat;
      },

      updateCategory: (id, patch) => {
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, ...patch } : c,
          ),
        }));
      },

      removeCategory: (id) => {
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          // 関連 Transaction は残す（categoryId は残す = "削除済カテゴリ" として表示）
        }));
      },

      reorderCategories: (ids) => {
        set((s) => {
          const map = new Map(s.categories.map((c) => [c.id, c]));
          const reordered: Category[] = [];
          ids.forEach((id, idx) => {
            const c = map.get(id);
            if (c) reordered.push({ ...c, sortOrder: (idx + 1) * 10 });
          });
          // ids に含まれなかったものは末尾に残す
          for (const c of s.categories) {
            if (!ids.includes(c.id)) reordered.push(c);
          }
          return { categories: reordered };
        });
      },

      addTransaction: (input) => {
        const t: Transaction = {
          id: uuid(),
          categoryId: input.categoryId,
          amount: input.amount,
          date: input.date,
          memo: input.memo,
          receiptImageUrl: input.receiptImageUrl,
          isAutoGenerated: input.isAutoGenerated ?? false,
          fixedCostId: input.fixedCostId,
          createdAt: Date.now(),
        };
        set((s) => ({ transactions: [...s.transactions, t] }));
        return t;
      },

      updateTransaction: (id, patch) => {
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t,
          ),
        }));
      },

      removeTransaction: (id) => {
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        }));
      },

      addTransactionPreset: ({ categoryId, amount, memo: inputMemo }) => {
        if (!isPositiveYen(amount)) return;

        const { categories, transactionPresets } = get();
        if (!categories.some((category) => category.id === categoryId && category.type === "expense")) return;

        const memo = inputMemo?.trim() || undefined;
        const existing = transactionPresets.find(
          (preset) => preset.categoryId === categoryId && preset.amount === amount && preset.memo === memo,
        );
        if (existing) return existing;

        const preset: TransactionPreset = { id: uuid(), categoryId, amount, memo, createdAt: Date.now() };
        set({ transactionPresets: [...transactionPresets, preset] });
        writeFeatureSnapshot(get());
        return preset;
      },

      removeTransactionPreset: (id) => {
        const { transactionPresets } = get();
        const remaining = transactionPresets.filter((preset) => preset.id !== id);
        if (remaining.length === transactionPresets.length) return;

        set({ transactionPresets: remaining });
        writeFeatureSnapshot(get());
      },

      addSavingsGoal: ({ name: inputName, targetAmount }) => {
        const name = inputName.trim();
        if (!name || !isPositiveYen(targetAmount)) return;

        const goal: SavingsGoal = { id: uuid(), name, targetAmount, contributions: [], createdAt: Date.now() };
        set((state) => ({ savingsGoals: [...state.savingsGoals, goal] }));
        writeFeatureSnapshot(get());
        return goal;
      },

      updateSavingsGoal: (id, { name: inputName, targetAmount }) => {
        const name = inputName.trim();
        if (!name || !isPositiveYen(targetAmount)) return;

        const { savingsGoals } = get();
        const goal = savingsGoals.find((item) => item.id === id);
        if (!goal || (goal.name === name && goal.targetAmount === targetAmount)) return;

        set({ savingsGoals: savingsGoals.map((item) => item.id === id ? { ...item, name, targetAmount } : item) });
        writeFeatureSnapshot(get());
      },

      removeSavingsGoal: (id) => {
        const { savingsGoals } = get();
        const remaining = savingsGoals.filter((goal) => goal.id !== id);
        if (remaining.length === savingsGoals.length) return;

        set({ savingsGoals: remaining });
        writeFeatureSnapshot(get());
      },

      addSavingsContribution: (goalId, amount) => {
        if (!isPositiveYen(amount)) return;

        const { savingsGoals } = get();
        const goal = savingsGoals.find((item) => item.id === goalId);
        if (!goal) return;

        const savedAmount = goal.contributions.reduce((total, contribution) => total + contribution.amount, 0);
        if (!Number.isSafeInteger(savedAmount + amount)) return;

        const contribution: SavingsContribution = { id: uuid(), amount, createdAt: Date.now() };
        set({
          savingsGoals: savingsGoals.map((item) => item.id === goalId
            ? { ...item, contributions: [...item.contributions, contribution] }
            : item),
        });
        writeFeatureSnapshot(get());
      },

      removeSavingsContribution: (goalId, contributionId) => {
        const { savingsGoals } = get();
        const goal = savingsGoals.find((item) => item.id === goalId);
        if (!goal) return;

        const contributions = goal.contributions.filter((contribution) => contribution.id !== contributionId);
        if (contributions.length === goal.contributions.length) return;

        set({ savingsGoals: savingsGoals.map((item) => item.id === goalId ? { ...item, contributions } : item) });
        writeFeatureSnapshot(get());
      },

      addFixedCost: (input) => {
        const fc: FixedCost = {
          id: uuid(),
          categoryId: input.categoryId,
          amount: input.amount,
          paymentDay: input.paymentDay,
          label: input.label,
          active: input.active ?? true,
          createdAt: Date.now(),
        };
        set((s) => ({ fixedCosts: [...s.fixedCosts, fc] }));
        return fc;
      },

      updateFixedCost: (id, patch) => {
        set((s) => ({
          fixedCosts: s.fixedCosts.map((f) =>
            f.id === id ? { ...f, ...patch } : f,
          ),
        }));
      },

      removeFixedCost: (id) => {
        set((s) => ({
          fixedCosts: s.fixedCosts.filter((f) => f.id !== id),
          // 生成済 Transaction は残す
        }));
      },

      setSelectedMonth: (monthKey) => set({ selectedMonth: monthKey }),

      setDailyBudgetGoal: (amount) => {
        if (!Number.isSafeInteger(amount) || amount < 0) return;

        const effectiveFrom = todayLocal();
        set((state) => ({
          dailyBudgetGoals: [
            ...state.dailyBudgetGoals.filter((goal) => goal.effectiveFrom !== effectiveFrom),
            { effectiveFrom, amount },
          ].sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom)),
        }));
      },

      updateWardrobe: (today, outfit) => {
        const { unlockedOutfits, activeOutfit, velvetEarnedDate, dailyBudgetGoals, transactions, categories } = get();
        const spending = getDailySpending(transactions, categories);
        const progress = getWardrobeProgress(today, dailyBudgetGoals, spending, unlockedOutfits, velvetEarnedDate);
        const availableOutfits = getUnlockedOutfits(progress, unlockedOutfits);
        const selection = outfit && availableOutfits.includes(outfit) ? outfit : activeOutfit;
        if (availableOutfits.length === unlockedOutfits.length
          && selection === activeOutfit
          && progress.velvetEarnedDate === velvetEarnedDate) return;

        set({ unlockedOutfits: availableOutfits, activeOutfit: selection, velvetEarnedDate: progress.velvetEarnedDate });
      },

      // 試着操作では persist を経由せず、家計簿データを書き戻さない。
      setDebugOutfit: (debugOutfit) => setTransient({ debugOutfit }),

      applyFixedCostsForMonth: (monthKey) => {
        const { fixedCosts, appliedFixedCostMonths } = get();
        let count = 0;
        for (const fc of fixedCosts.filter((f) => f.active)) {
          const applied = appliedFixedCostMonths[fc.id] ?? [];
          if (applied.includes(monthKey)) continue;
          const input = fixedCostToTransactionInput(fc, monthKey);
          get().addTransaction(input);
          set((s) => ({
            appliedFixedCostMonths: {
              ...s.appliedFixedCostMonths,
              [fc.id]: [...(s.appliedFixedCostMonths[fc.id] ?? []), monthKey],
            },
          }));
          count++;
        }
        return count;
      },

      getMonthlyTransactions: (monthKey) => {
        return get()
          .transactions.filter((t) => monthKeyOf(t.date) === monthKey)
          .sort((a, b) => b.date.localeCompare(a.date));
      },

      getMonthlyTotals: (monthKey) => {
        const txs = get().getMonthlyTransactions(monthKey);
        let expense = 0;
        let income = 0;
        for (const t of txs) {
          const cat = get().categories.find((c) => c.id === t.categoryId);
          if (cat?.type === "income") income += t.amount;
          else expense += t.amount;
        }
        return { expense, income, balance: income - expense };
      },

      getMonthlyByCategory: (monthKey) => {
        const txs = get().getMonthlyTransactions(monthKey);
        const map = new Map<string, number>();
        for (const t of txs) {
          map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
        }
        const rows: CategoryTotal[] = [];
        for (const [categoryId, total] of map) {
          const cat = get().categories.find((c) => c.id === categoryId);
          if (!cat) continue; // 削除済カテゴリは chart で無視
          rows.push({ category: cat, total });
        }
        return rows.sort((a, b) => b.total - a.total);
      },

      getCategoryById: (id) => get().categories.find((c) => c.id === id),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version): PersistedBudgetState => {
        const state = persistedState as PersistedBudgetState;
        if (version === 1) return { ...state, dailyBudgetGoals: [], ...initialWardrobe, ...readFeatureSnapshot() };
        if (version === 2) return { ...state, ...initialWardrobe, ...readFeatureSnapshot() };
        if (version === 3) return { ...state, ...readFeatureSnapshot() };
        return state;
      },
      partialize: (state) => ({
        categories: state.categories,
        transactions: state.transactions,
        transactionPresets: state.transactionPresets,
        fixedCosts: state.fixedCosts,
        savingsGoals: state.savingsGoals,
        selectedMonth: state.selectedMonth,
        appliedFixedCostMonths: state.appliedFixedCostMonths,
        dailyBudgetGoals: state.dailyBudgetGoals,
        unlockedOutfits: state.unlockedOutfits,
        activeOutfit: state.activeOutfit,
        velvetEarnedDate: state.velvetEarnedDate,
      }),
    },
  )(setTransient, get, api);

export const useBudgetStore = create<BudgetStore>()(createBudgetStore);
