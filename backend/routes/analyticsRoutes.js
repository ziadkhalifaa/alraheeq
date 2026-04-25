import express from 'express';
import { getOverviewStats, getProductPerformance } from '../controllers/analyticsController.js';
// Add authentication middleware if needed - assuming Admin only
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/overview', getOverviewStats);
router.get('/products', getProductPerformance);

export default router;
