import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. ユーザーの保有合計ポイント取得
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

// 2. ポイント履歴を取得
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

// 3. ポイント付与（管理者操作）←★追加
export const grantPoint = async (req: Request, res: Response) => {
  const { userId, eventId, points, slot } = req.body;
  if (!userId || !eventId || !points) {
    res.status(400).json({ message: '必要な情報が不足しています' });
    return;
  }
  try {
    const grantedAt = new Date();
    const created = await prisma.point.create({
      data: {
        userId,
        eventId,
        points,
        grantedAt,
      }
    });
    res.json({ message: "ポイント付与成功", data: created });
  } catch (err) {
    res.status(400).json({ message: 'ポイント付与失敗', error: err });
  }
};