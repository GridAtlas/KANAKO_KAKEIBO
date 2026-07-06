/**
 * Tailwind color 名 → HEX（chart 用）。
 * Home の円グラフや履歴の色付けで使う。
 */

export const COLOR_HEX: Record<string, string> = {
  rose:    "#f43f5e",
  red:     "#ef4444",
  orange:  "#f97316",
  amber:   "#f59e0b",
  yellow:  "#eab308",
  lime:    "#84cc16",
  green:   "#22c55e",
  emerald: "#10b981",
  teal:    "#14b8a6",
  cyan:    "#06b6d4",
  sky:     "#0ea5e9",
  blue:    "#3b82f6",
  indigo:  "#6366f1",
  violet:  "#8b5cf6",
  purple:  "#a855f7",
  fuchsia: "#d946ef",
  pink:    "#ec4899",
  slate:   "#64748b",
};

export function colorHex(name: string): string {
  return COLOR_HEX[name] ?? COLOR_HEX.slate;
}

/**
 * Tailwind の bg / text クラス名を返す（ 動的 class は content scan で拾えない ため、
 * 事前列挙で safelist される必要がある。tailwind.config.ts の safelist に追加検討）
 */
export function bgClass(color: string): string {
  return `bg-${color}-100 text-${color}-700`;
}
