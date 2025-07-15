# section9_teamD

# Backend - Express + Prisma + Redis + Vitest

## 📦 使用技術

- Express / TypeScript
- Prisma ORM / MySQL or PostgreSQL
- Redis (キャッシュ)
- Stripe / Firebase Authentication
- Vitest（ユニットテスト）
- Docker / Docker Compose

## 🚀 開発環境構築

```bash
docker compose up --build
```

### マイグレーション（初回のみ）

```bash
docker compose exec backend npx prisma migrate dev --name init
```

### テスト実行

```bash
npm run test
```

## ✅ プルリクエストのルール一覧（チーム共通）

| ルール内容 |
|------------|
| タイトルは「目的｜対象ファイルや機能名」でわかりやすく書く |
| 概要・背景・変更内容・影響範囲・スクショ（あれば）を明記 |
| ローカルで動作確認・lint・format済みであることを前提に出す |
| WIP（作業中）のときは `[WIP]` をタイトルに含める |
| 他人が見てすぐ理解できるよう、Markdownで整形して書く |

## ✅ プルリクエストのテンプレート

## 🔍 概要
- ○○機能の追加（または修正／削除）
- 対象ページ：`/example-page`
- 対象ファイル：`example.tsx`, `example-api.ts`

## 🎯 背景・目的
- なぜこの変更を行ったか
- 例）◯◯のUX改善のため、△△のような動作に修正した

## 🛠️ 変更内容
- 追加：〇〇コンポーネント
- 修正：APIのレスポンス構造を変更
- 削除：未使用だった××関数

## 🧪 動作確認
- [x] ローカルで表示確認
- [x] Lint / Format 実行済み
- [x] 該当機能のテストが通ることを確認（手動／自動）

## 📷 スクリーンショット（UI変更時のみ）
> 変更前・変更後の比較を画像で貼付

## 📝 補足
- 今後この部分をhooks化する予定です
