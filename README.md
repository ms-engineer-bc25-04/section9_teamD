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
