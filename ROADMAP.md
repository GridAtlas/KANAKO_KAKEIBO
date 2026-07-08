# KANAKO_KAKEIBO ROADMAP

## Phase 0: ブートストラップ（完了）

- [x] Next.js 14 + TypeScript + Tailwind の scaffold
- [x] Zustand store（`useBudgetStore`）+ persist middleware
- [x] 型定義（`types/index.ts`）
- [x] 日付・金額ユーティリティ（`lib/date.ts`, `lib/money.ts`）
- [x] デフォルトカテゴリ（食費・家賃・光熱費・サブスク等）
- [x] BottomNav + 中央 FAB
- [x] Home（月次サマリ + 直近履歴）
- [x] Add ページ（金額 / カテゴリ / 日付 / メモ）
- [x] History ページ（月別一覧、カテゴリフィルタ）
- [x] Settings → カテゴリ管理
- [x] Settings → 固定費管理
- [x] 固定費 → Transaction 自動生成ロジック（`applyFixedCostsForMonth`）
- [x] README.md / AGENTS.md / DESIGN.md
- [x] GitHub init bat

## Phase 1: MVP 機能完成

優先度: **高**

- [ ] **円グラフ実装**（recharts の PieChart、Home 中央に配置）
- [ ] **カテゴリ並替 UI**（ドラッグ or 上下ボタン、@dnd-kit 追加検討）
- [ ] **カテゴリの削除時の Transaction 扱い**: 「削除」時に既存 Transaction を "その他" に移すか、削除カテゴリを保持するかの UX 決定 + 実装
- [ ] **日次の固定費適用ジョブ**: アプリ起動時に「今月分の固定費を適用しますか？」promoter、または自動適用
- [ ] **月切替 UI**（Home / History で前月・翌月ナビ）
- [ ] **カテゴリ絞込フィルタ**（History）
- [ ] **タイムスタンプ厳密化**: date は "YYYY-MM-DD"、createdAt は ms 単位
- [ ] **アクセシビリティ最小**: aria-label / focus 管理

優先度: **中**

- [ ] **編集画面**: 既存 Transaction を tap で編集モーダル
- [ ] **収入登録の UX 分離**: 「支出 / 収入」トグルを Add ページに
- [ ] **サマリカードの色分け**（支出=赤系 / 収入=緑系）
- [ ] **予算設定**: カテゴリ別に月次予算、超過時に赤字警告
- [ ] **CSV / JSON エクスポート**

## Phase 2: 可視化強化

- [x] **月次推移の棒グラフ**（Home に直近 6 か月の収入 / 支出を表示）
- [x] **貯金率・平均収支カード**（Home に貯金率 / 前月比 / 平均収支を表示）
- [ ] **カテゴリ別月次推移の折線グラフ**
- [ ] **年次サマリ**（12 か月合計 + トップカテゴリ）
- [ ] **予算 vs 実績のプログレスバー**
- [ ] **ダーク / ライト テーマ切替**
- [ ] **PWA 化**（manifest + service worker、ホーム画面追加、オフライン）

## Phase 3: レシート OCR + クラウド

- [ ] **カメラ撮影**（`<input type="file" capture="environment">`）
- [ ] **OCR API 連携**（Google Cloud Vision API 経由、Next.js API Route）
- [ ] **抽出結果の Preview + 補正 UI**
- [ ] **画像の Cloud Storage 保存**（Firebase Storage or Supabase Storage）
- [ ] **Firebase Auth**（Google Sign-in）
- [ ] **Firestore 同期**（オフライン → オンラインの merge）
- [ ] **多デバイス対応**（PC + スマホ）

## Phase 4: 発展・分析

- [ ] **AI レコメンド**: 「先月より食費が 30% 増えています」等
- [ ] **カレンダービュー**: 月表示で日ごとの合計
- [ ] **カテゴリ推定**: 金額 / メモから自動でカテゴリ提案
- [ ] **共有家計**: パートナーと共有できる家計簿
- [ ] **銀行連携**（Money Forward API / Zaim API 等の検討）

## 設計上の決定事項

- **localStorage を default 永続化**（アカウント不要で使える）
- **クラウド同期は Phase 3 以降**（最小機能で使える状態を優先）
- **単一 Zustand store**、React Query / SWR は導入しない
- **スタイルは Tailwind utility のみ**
- **カテゴリの type (expense/income) と isFixedCost は Category に持つ**（仕様通り）
- **Transaction の符号で収入/支出を分けない**（Category.type から derive）
- **月キーは "YYYY-MM"**（文字列比較でソート可能）

## 検討中・未決事項

- カテゴリ削除時: 関連 Transaction の扱い（"その他" に移す / 削除カテゴリ保持 / 削除ブロック）
- 固定費適用: 月初に自動適用 vs ユーザーに確認 vs 手動のみ
- 収入登録の UX: 「支出/収入」トグル vs カテゴリ選択で自動判定
- 予算超過時の警告レベル（80%/100%/120% で色変え？）
- CSV export のカラム構成
- Phase 3 の Firebase → Supabase 乗換の可能性
- レシート画像の削除 UX（誤登録時の巻き戻し）
