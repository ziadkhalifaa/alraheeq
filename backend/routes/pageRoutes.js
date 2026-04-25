import express from 'express';
import { 
  getPageContent, 
  updatePageContent, 
  getAllPages, 
  createPage, 
  deletePage,
  publishPageContent
} from '../controllers/pageContentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for frontend to consume content)
router.get('/:slug/content', getPageContent);

// Protected routes (for admin editor)
router.use(authenticateToken);

router.get('/', getAllPages);
router.post('/', createPage);
router.delete('/:id', deletePage);

router.put('/:slug/content', updatePageContent);
router.post('/:slug/publish', publishPageContent);

export default router;
