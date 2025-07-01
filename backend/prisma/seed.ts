// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.stamp.deleteMany() // 初期化（開発用）

  await prisma.stamp.createMany({
    data: [
      {
        name: 'ありがとうございます',
        imageUrl: 'https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/%E3%81%82%E3%82%8A%E3%81%8C%E3%81%A8%E3%81%86%E3%81%94%E3%81%96%E3%81%84%E3%81%BE%E3%81%99.png',
      },
      {
        name: 'おつかれさまでした',
        imageUrl: 'https://chokotto-stamps.s3.ap-northeast-1.amazonaws.com/%E3%81%8A%E3%81%A4%E3%81%8B%E3%82%8C%E3%81%95%E3%81%BE%E3%81%A7%E3%81%97%E3%81%9F%F0%9F%91%8F.png',
      },
        ],
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
