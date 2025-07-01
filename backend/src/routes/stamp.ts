import express from 'express'
import { getStamps, sendStamp } from '../controllers/stampController' // ✅ 名前付きでインポート
const router = express.Router()

// スタンプ一覧取得
router.get('/stamps', getStamps)

// スタンプ送信
router.post('/send-stamp', sendStamp)

export default router
