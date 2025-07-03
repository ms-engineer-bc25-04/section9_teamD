import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Nurseryを先に作成
  const nursery = await prisma.nursery.create({
    data: {
      name: 'テスト保育園'
    }
  });

  // 2. nursery.idを使ってユーザーを作成
  // ユーザー1件
  await prisma.user.create({
    data: {
      email: 'ayaka@example.com',
      passwordHash: 'hashedpassword',
      name: '中村あやか',
      role: 'parent',
      isAdmin: false,
      nursery: {
      connect: { id: nursery.id } // nurseryを必ず指定
    }
    },
  });
  // 職員1件
  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@example.com',
      passwordHash: 'hashedpassword',
      name: '高橋さやか',
      role: 'staff',
      isAdmin: true,
      nursery: {
      connect: { id: nursery.id } // nurseryを必ず指定
    }
    },
  });
  // イベント1件
  await prisma.event.create({
    data: {
      title: '運動会準備',
      date: new Date(),
      capacity: 5,
      description: '運動会の準備をします',
      deadline: new Date(),
      pointReward: 20,
      createdById: staffUser.id,
      startTime: new Date(), // 必須
      endTime: new Date(),   // 必須
      location: '場所',      // 必須
      privilegeAllowed: true // 必須
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
