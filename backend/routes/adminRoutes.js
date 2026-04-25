import express from 'express';
import jwt from 'jsonwebtoken';
import { login, logout, createProduct, updateProduct, deleteProduct } from '../controllers/adminController.js';
import { getMe } from '../controllers/meController.js';
import { uploadImage } from '../controllers/uploadController.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate, loginValidationRules, productValidationRules } from '../middleware/validator.js';
import multer from 'multer';
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' } });

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

import { authenticateToken } from '../middleware/auth.js';

router.post('/login', authLimiter, validate(loginValidationRules), login);
router.post('/logout', logout);

// Protected routes
router.use(authenticateToken);
router.use(csrfProtection);

router.get('/me', getMe);
router.post('/upload', upload.single('image'), uploadImage);
router.post('/products', validate(productValidationRules), createProduct);
router.put('/products/:id', validate(productValidationRules), updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
