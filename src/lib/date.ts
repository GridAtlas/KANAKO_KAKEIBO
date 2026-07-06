/** "2026-06-19" のような日付文字列と月キーのユーティリティ */

export function todayLocal(): string {
  const d = new Date();
  return dateToLocalString(d);
}

export function dateToLocalString(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthKeyOf(dateStr: string): string {
  return dateStr.slice(0, 7);
}

/** "2026-06" → { year: 2026, month: 6 } */
export function parseMonthKey(monthKey: string): { year: number; month: number } {
  const [y, m] = monthKey.split("-").map(Number);
  return { year: y, month: m };
}

/** "2026-06" の月末日 */
export function daysInMonth(monthKey: string): number {
  const { year, month } = parseMonthKey(monthKey);
  return new Date(year, month, 0).getDate();
}

/** 月キーを 1 か月動かす */
export function shiftMonthKey(monthKey: string, delta: number): string {
  const { year, month } = parseMonthKey(monthKey);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** "2026-06" → "2026 年 6 月" */
export function formatMonthLabel(monthKey: string): string {
  const { year, month } = parseMonthKey(monthKey);
  return `${year} 年 ${month} 月`;
}

/** "2026-06-19" → "6月19日 (金)" */
export function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dow = "日月火水木金土"[new Date(y, m - 1, d).getDay()];
  return `${m}月${d}日 (${dow})`;
}
