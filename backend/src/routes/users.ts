import express from 'express'
import { PrismaClient } from '@prisma/client'
const router = express.Router()
const prisma = new PrismaClient()

// 全ユーザー一覧
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'ユーザー取得失敗', detail: err })
  }
})

export default router
