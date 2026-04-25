import express from 'express';
import { uploadMedia, uploadMiddleware, getAllMedia, deleteMedia } from '../controllers/mediaController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllMedia);
router.post('/upload', authenticateToken, uploadMiddleware, uploadMedia);
router.delete('/:id', authenticateToken, deleteMedia);

export default router;
