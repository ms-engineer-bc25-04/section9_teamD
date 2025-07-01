import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

// GET /api/stamps：スタンプ一覧取得
export const getStamps = async (req: Request, res: Response) => {
  try {
    const stamps = await prisma.stamp.findMany()
    return res.json(stamps)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch stamps' })
  }
}

// POST /api/send-stamp：スタンプ送信
export const sendStamp = async (req: Request, res: Response) => {
  const { parentId, schoolId, stampId } = req.body
  try {
    const result = await prisma.sentStamp.create({
      data: { parentId, schoolId, stampId },
    })
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to send stamp' })
  }
}
