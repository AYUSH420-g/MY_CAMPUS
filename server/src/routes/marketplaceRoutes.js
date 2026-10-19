import express from 'express';
import {
  getMarketplaceItems,
  getMarketplaceItemById,
  createMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem,
  getMyMarketplaceItems,
} from '../controllers/marketplaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMarketplaceItems);
router.get('/my/listings', protect, getMyMarketplaceItems);
router.get('/:id', getMarketplaceItemById);
router.post('/', protect, createMarketplaceItem);
router.put('/:id', protect, updateMarketplaceItem);
router.delete('/:id', protect, deleteMarketplaceItem);

export default router;
