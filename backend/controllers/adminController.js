import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../lib/db.js';
import { APIError } from '../middleware/errorHandler.js';
import { sanitize } from '../lib/sanitizer.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await query('SELECT * FROM admins WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      throw new APIError('Invalid credentials', 401);
    }

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      throw new APIError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('alraheeq_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({ username: admin.username, role: admin.role });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('alraheeq_token');
  res.json({ message: 'Logged out successfully' });
};

export const createProduct = async (req, res, next) => {
  try {
    const { 
      name, description, slug, price, image_url, category_id, 
      origin, images, specs, uses, benefits, packaging 
    } = req.body;
    
    // Sanitize multilingual inputs and JSONB fields
    const cleanName = sanitize(name);
    const cleanDescription = sanitize(description);
    const cleanSpecs = sanitize(specs);
    const cleanUses = sanitize(uses);
    const cleanBenefits = sanitize(benefits);
    const cleanPackaging = sanitize(packaging);

    const result = await query(
      `INSERT INTO products (
        name, description, slug, price, image_url, category_id, 
        origin, images, specs, uses, benefits, packaging
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        cleanName, cleanDescription, slug, price, image_url, category_id, 
        origin, images || [], cleanSpecs || {}, cleanUses || {}, 
        cleanBenefits || {}, cleanPackaging || {}
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      name, description, slug, price, image_url, category_id, 
      origin, images, specs, uses, benefits, packaging 
    } = req.body;

    // Sanitize multilingual inputs
    const cleanName = sanitize(name);
    const cleanDescription = sanitize(description);
    const cleanSpecs = sanitize(specs);
    const cleanUses = sanitize(uses);
    const cleanBenefits = sanitize(benefits);
    const cleanPackaging = sanitize(packaging);

    const result = await query(
      `UPDATE products SET 
        name = $1, description = $2, slug = $3, price = $4, image_url = $5, 
        category_id = $6, origin = $7, images = $8, specs = $9, 
        uses = $10, benefits = $11, packaging = $12 
      WHERE id = $13 RETURNING *`,
      [
        cleanName, cleanDescription, slug, price, image_url, 
        category_id, origin, images || [], cleanSpecs || {}, 
        cleanUses || {}, cleanBenefits || {}, cleanPackaging || {}, id
      ]
    );

    if (result.rows.length === 0) {
      throw new APIError('Product not found', 404);
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      throw new APIError('Product not found', 404);
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
