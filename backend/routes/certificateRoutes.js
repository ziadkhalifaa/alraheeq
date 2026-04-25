
import express from 'express';
import { getAllCertificates, createCertificate, updateCertificate, deleteCertificate } from '../controllers/certificateController.js';
import { authenticateToken } from '../middleware/auth.js';
import csrf from 'csurf';

const router = express.Router();
const csrfProtection = csrf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' } });

router.get('/', getAllCertificates);

// Admin only
router.post('/admin', authenticateToken, csrfProtection, createCertificate);
router.put('/admin/:id', authenticateToken, csrfProtection, updateCertificate);
router.delete('/admin/:id', authenticateToken, csrfProtection, deleteCertificate);

export default router;
