import express from 'express';
import {
  getLostFoundItems,
  getLostFoundItemById,
  createLostFoundItem,
  getMatchesForItem,
  resolveMatch,
  getMyReports,
} from '../controllers/lostFoundController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getLostFoundItems);
router.get('/my/reports', protect, getMyReports);
router.get('/:id', getLostFoundItemById);
router.get('/:id/matches', getMatchesForItem);
router.post('/', protect, createLostFoundItem);
router.put('/:id/resolve', protect, resolveMatch);

export default router;
