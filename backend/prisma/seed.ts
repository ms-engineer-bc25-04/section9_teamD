// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // -----------------------------
  // 1. Stampテーブル初期化 → 3件作成
  // -----------------------------
  await prisma.stamp.deleteMany()

  await prisma.stamp.createMany({
    data: [
      {
        name: 'ありがとうございます',
        imageUrl: 'https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/arigatou.png',
      },
      {
        name: 'おつかれさまでした',
        imageUrl: 'https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/otukaresama.png',
      },
      {
        name: 'がんばった',
        imageUrl: 'https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/ganbatta.png',
      },
    ],
  })

  // -----------------------------
  // 2. 保育園を1件作成
  // -----------------------------
  const nursery = await prisma.nursery.create({
    data: {
      name: 'テスト保育園',
    },
  })

  // -----------------------------
  // 3. ユーザー（保護者）1件作成
  // -----------------------------
  await prisma.user.create({
    data: {
      email: 'ayaka@example.com',
      passwordHash: 'hashedpassword',
      name: '中村あやか',
      role: 'parent',
      isAdmin: false,
      nursery: {
        connect: { id: nursery.id },
      },
    },
  })

  // -----------------------------
  // 4. ユーザー（職員）1件作成
  // -----------------------------
  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@example.com',
      passwordHash: 'hashedpassword',
      name: '高橋さやか',
      role: 'staff',
      isAdmin: true,
      nursery: {
        connect: { id: nursery.id },
      },
    },
  })

  // -----------------------------
  // 5. イベント1件作成
  // -----------------------------
  await prisma.event.create({
    data: {
      title: '運動会準備',
      date: new Date(),
      capacity: 5,
      description: '運動会の準備をします',
      deadline: new Date(),
      pointReward: 20,
      createdById: staffUser.id,
      startTime: new Date().toISOString(), // 修正
      endTime: new Date().toISOString(),   // 修正
      location: '場所',
      privilegeAllowed: true,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
