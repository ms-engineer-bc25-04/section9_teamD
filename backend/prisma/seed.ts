
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'   // .env の DATABASE_URL を読む

const prisma = new PrismaClient()

async function main() {
  // 1. 保育園を作成
  const nursery = await prisma.nursery.create({
    data: { name: 'テスト保育園' },
  })

  // 2. 保護者ユーザーを作成
  const parentUser = await prisma.user.upsert({
    where: { email: 'ayaka@example.com' },
    update: {}, // 更新不要なら空
    create: {
      email:        'ayaka@example.com',
      passwordHash: 'hashedpassword',
      name:         '中村あやか',
      role:         'parent',
      isAdmin:      false,
      nursery:      { connect: { id: nursery.id } },
    },
  })

  // 3. 職員ユーザーを作成
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {}, // 更新不要なら空
    create: {
      email:        'staff@example.com',
      passwordHash: 'hashedpassword',
      name:         '高橋さやか',
      role:         'staff',
      isAdmin:      true,
      nursery:      { connect: { id: nursery.id } },
    },
  })

  // 4. イベントを作成し、そのIDを変数に保管
  const createdEvent = await prisma.event.create({
    data: {
      title:           '運動会準備',
      date:            new Date('2025-07-07'),
      capacity:        5,
      description:     '運動会の準備をします',
      deadline:        new Date('2025-07-07'),
      pointReward:     20,
      startTime:       new Date().toISOString(),
      endTime:         new Date().toISOString(),
      location:        '園庭',
      privilegeAllowed:true,
      createdById:     staffUser.id,
    },
  })

  // 5. 保護者のポイント履歴を作成（event_id もつなげる）
  await prisma.point.create({
    data: {
      userId:    parentUser.id,
      eventId:   createdEvent.id,
      points:    100,
      grantedAt: new Date(),
      // createdAt は schema.prisma 側で @default(now()) がついていれば不要
    },
  })

  // 6. 景品（rewards）を複数作成
  const rewards = [
    {
      name:           '運動会前列スペース 秋',
      pointsRequired: 100,
      description:    '1家庭1回まで、定員6家庭',
      capacity:       6,    // ← 必須！
    },
    {
      name:           '面談時間 優先予約枠',
      pointsRequired: 30,
      description:    '各時間帯ごとに枠制限あり',
      capacity:       10,
    },
    // ... 他のアイテムも同様に
  ]

  for (const r of rewards) {
    await prisma.reward.create({ data: r })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

