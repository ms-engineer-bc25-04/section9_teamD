import express from 'express';
import {
  getRewards,
  createReward,
  updateReward,
  deleteReward
} from '../controllers/reward-controller';

const router = express.Router();

router.get('/', getRewards);
router.post('/', createReward);
router.put('/:id', updateReward);
router.delete('/:id', deleteReward);

export default router;
