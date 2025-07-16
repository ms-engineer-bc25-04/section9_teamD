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

## 🧑‍💻 コーディング規約（Coding Convention）

### 📝 命名スタイル

- 命名はコードの可読性を大きく左右するため、以下のルールに従います。

| 名前の種類                     | 書き方                 | 例                            |
| ------------------------------ | ---------------------- | ----------------------------- |
| 変数 / 関数 / インスタンス     | `camelCase`            | `userName`, `fetchUser`       |
| 型（type / interface / class） | `PascalCase`           | `UserInfo`, `AuthContext`     |
| 定数（.env など）              | `SCREAMING_SNAKE_CASE` | `MAX_USER_COUNT`              |
| 真偽値（boolean 型）           | `isXxx`, `hasXxx`      | `isLoggedIn`, `hasPermission` |

### ❌ 禁止事項

- 意味のない**1 文字の命名は禁止**

```ts
// ❌ NG
const q = () => {};

// ✅ OK
const query = () => {};
```

### 変数宣言のルール

- const：基本の宣言（再代入しない場合）
- let：再代入が必要なときのみ使用
- var：使用禁止（スコープが不明瞭になるため）

```ts
const name = "Eriko"; // ✅ OK
let count = 0; // ✅ 再代入の必要があるときだけ
```

### 🗂️ ファイル・ディレクトリ構成

📁 ファイル命名ルール：kebab-case
小文字とハイフン（-）で統一
拡張子を忘れずに（例：.tsx, .ts）

```
components/user-card.tsx
hooks/use-auth.ts
```

### 📦 ディレクトリの役割ごとの構成

| ディレクトリ名 | 用途説明                                   |
| -------------- | ------------------------------------------ |
| components     | 再利用可能な UI 部品（ボタン・カードなど） |
| hooks          | カスタムフック（React 専用の再利用処理）   |
| lib            | 外部連携・ロジック処理（API, 認証など）    |
| features       | 機能ごとのまとまり（ドメイン単位）         |
| utils          | 汎用的な便利関数（フォーマットなど）       |
