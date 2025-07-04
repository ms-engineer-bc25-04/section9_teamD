import express from 'express';
import { getUserPoint, getUserPointHistory } from '../controllers/point-controller';

const router = express.Router();

// ユーザーの保有ポイント
router.get('/:userId', getUserPoint);

// ユーザーのポイント履歴
router.get('/:userId/history', getUserPointHistory);

export default router;
