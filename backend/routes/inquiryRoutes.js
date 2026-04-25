import express from 'express';
import { 
  createInquiry, 
  getAllInquiries, 
  updateInquiryCRM, 
  getInquiryById, 
  getUnreadCount, 
  exportCSV 
} from '../controllers/inquiryController.js';
import { authenticateToken } from '../middleware/auth.js';
import csrf from 'csurf';

const router = express.Router();
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' } });

router.post('/', createInquiry); // Public

// Admin only
router.get('/admin', authenticateToken, getAllInquiries);
router.get('/admin/unread', authenticateToken, getUnreadCount);
router.get('/admin/export', authenticateToken, exportCSV);
router.get('/admin/:id', authenticateToken, getInquiryById);
router.patch('/admin/:id', authenticateToken, csrfProtection, updateInquiryCRM);

export default router;
