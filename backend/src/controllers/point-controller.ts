import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 保有ポイントを取得
export const getUserPoint = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // 最新の合計値で返す場合
    const points = await prisma.point.aggregate({
      _sum: { points: true },
      where: { userId }
    });
    res.json({ userId, point: points._sum.points || 0 });
  } catch (err) {
    res.status(400).json({ message: '取得失敗', error: err });
  }
};

// ポイント履歴を取得
export const getUserPointHistory = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const history = await prisma.point.findMany({
      where: { userId },
      orderBy: { grantedAt: 'desc' }
    });
    res.json(history);
  } catch (err) {
    res.status(400).json({ message: '履歴取得失敗', error: err });
  }
};
