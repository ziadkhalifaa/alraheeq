import { query } from '../lib/db.js';
import { APIError } from '../middleware/errorHandler.js';

export const getCategories = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
