import type { Category } from "@/types";

/** 初回起動時に seed するデフォルトカテゴリ */
export const DEFAULT_CATEGORIES: Omit<Category, "id" | "createdAt">[] = [
  { name: "食費",     icon: "Utensils",       color: "rose",    type: "expense", isFixedCost: false, sortOrder: 10 },
  { name: "家賃",     icon: "Home",           color: "amber",   type: "expense", isFixedCost: true,  sortOrder: 20 },
  { name: "光熱費",   icon: "Zap",            color: "yellow",  type: "expense", isFixedCost: true,  sortOrder: 30 },
  { name: "通信費",   icon: "Wifi",           color: "sky",     type: "expense", isFixedCost: true,  sortOrder: 40 },
  { name: "サブスク", icon: "RefreshCcw",     color: "violet",  type: "expense", isFixedCost: true,  sortOrder: 50 },
  { name: "交通費",   icon: "Car",            color: "blue",    type: "expense", isFixedCost: false, sortOrder: 60 },
  { name: "日用品",   icon: "ShoppingBag",    color: "cyan",    type: "expense", isFixedCost: false, sortOrder: 70 },
  { name: "医療費",   icon: "Stethoscope",    color: "pink",    type: "expense", isFixedCost: false, sortOrder: 80 },
  { name: "娯楽",     icon: "Gamepad2",       color: "purple",  type: "expense", isFixedCost: false, sortOrder: 90 },
  { name: "交際費",   icon: "Users",          color: "indigo",  type: "expense", isFixedCost: false, sortOrder: 100 },
  { name: "その他",   icon: "MoreHorizontal", color: "slate",   type: "expense", isFixedCost: false, sortOrder: 110 },
  { name: "給料",     icon: "Wallet",         color: "emerald", type: "income",  isFixedCost: false, sortOrder: 200 },
  { name: "副収入",   icon: "TrendingUp",     color: "teal",    type: "income",  isFixedCost: false, sortOrder: 210 },
];

/** 追加時に選べるアイコン一覧 */
export const AVAILABLE_ICONS = [
  "Utensils", "Home", "Zap", "Wifi", "RefreshCcw", "Car", "ShoppingBag",
  "Stethoscope", "Gamepad2", "Users", "Wallet", "TrendingUp", "MoreHorizontal",
  "Coffee", "Beer", "Music", "Film", "Book", "GraduationCap", "Baby",
  "PawPrint", "Shirt", "Scissors", "Palette", "Dumbbell", "Bike",
  "Plane", "Train", "Bus", "Fuel", "CreditCard", "Gift", "HandHeart",
  "Sparkles", "Waves", "Leaf", "Flame",
] as const;

/** 追加時に選べる色一覧（Tailwind color 名） */
export const AVAILABLE_COLORS = [
  "rose", "red", "orange", "amber", "yellow", "lime", "green", "emerald",
  "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia",
  "pink", "slate",
] as const;

export const STORAGE_KEY = "kanako_kakeibo";
export const STORAGE_VERSION = 1;
