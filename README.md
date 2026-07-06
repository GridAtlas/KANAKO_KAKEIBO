# KANAKO_KAKEIBO

> かなこの家計簿 — スマホで動く WEB 家計簿アプリ
> ユーザーが自由にカテゴリを設定し、固定費・変動費を管理できる。円グラフで支出可視化、将来的にレシート OCR も対応。

## 概要

- カテゴリを自由に追加・編集（食費、趣味、サウナ代など）
- 固定費（家賃・光熱費・サブスクなど）は毎月自動計上
- 支出・収入を手動で記録
- 当月の支出を円グラフで可視化、カテゴリ別に集計
- モバイルファースト、スマホブラウザから直接使える WEB アプリ

## 機能（実装ステータス）

- ✅ Phase 1（MVP、この scaffold で提供）:
  - カテゴリ管理（追加・編集・削除・並替）
  - 支出・収入の手動登録（金額 / 日付 / カテゴリ / メモ）
  - 固定費の設定（毎月何日にいくら計上するか）
  - 月次サマリと直近履歴
- ⏳ Phase 2: 円グラフ表示（recharts）、カテゴリ別フィルタ、月切替
- ⏳ Phase 3: レシート撮影 OCR、固定費の自動計上ジョブ、Firebase 同期

詳細は `ROADMAP.md`。

## 起動

```powershell
npm install
npm run dev
```

ブラウザで `http://localhost:3000`。

## スマホから動作確認

```powershell
npm run dev:lan
ipconfig | findstr IPv4
```

スマホブラウザで `http://<PC の IP>:3000`。Windows ファイアウォールで Node の Inbound 許可が必要な場合あり。

## ビルド

```powershell
npm run build
npm run start
```

## スタック

- **Next.js 14**（App Router, TypeScript）
- **Tailwind CSS**（モバイル responsive）
- **Zustand + persist middleware**（localStorage に永続化）
- **recharts**（円グラフ / 棒グラフ、Phase 2 で有効化）
- **Lucide React**（カテゴリアイコン）

## データモデル

`src/types/index.ts` を参照。仕様書の 4 テーブル構造に準拠:

- `Category`: id / name / icon / color / type / isFixedCost
- `Transaction`: id / categoryId / amount / date / memo / receiptImageUrl?
- `FixedCost`: id / categoryId / amount / paymentDay / label
- （`User` は個人アプリのため MVP では単一プロファイル前提、schema のみ用意）

## データの保存場所

Phase 1〜2 は **localStorage 一本**（`kanako_kakeibo` キー配下）。**サーバに送らない**。

Phase 3 で Firebase or Supabase を導入予定（多デバイス同期・OCR 画像アップロード）。

## 開発体制

**開発主体は Codex**、Claude は設計議論・レビュー。

## ライセンス

MIT
