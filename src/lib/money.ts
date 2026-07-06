/** ¥ 表記フォーマット */

export function formatYen(amount: number): string {
  const rounded = Math.round(amount);
  return `¥${rounded.toLocaleString("ja-JP")}`;
}

export function formatYenNoSign(amount: number): string {
  const rounded = Math.round(amount);
  return rounded.toLocaleString("ja-JP");
}

/** 入力文字列を数値に。半角/全角の数字混在 OK */
export function parseYenInput(input: string): number {
  const s = input
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[^\d]/g, "");
  return s === "" ? 0 : Number(s);
}
