
import express from 'express';
import { getAllPosts, getPostBySlug, createPost, updatePost, deletePost } from '../controllers/blogController.js';
import { authenticateToken } from '../middleware/auth.js';
import csrf from 'csurf';

const router = express.Router();
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' } });

router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);

// Admin only
router.post('/admin', authenticateToken, csrfProtection, createPost);
router.put('/admin/:id', authenticateToken, csrfProtection, updatePost);
router.delete('/admin/:id', authenticateToken, csrfProtection, deletePost);

export default router;
