import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ユーザー1件
  await prisma.user.create({
    data: {
      email: 'ayaka@example.com',
      passwordHash: 'hashedpassword', // パスワードはハッシュ化したダミー
      name: '中村あやか',
      role: 'parent',
      isAdmin: false,
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
