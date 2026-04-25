import { query } from '../lib/db.js';
import { APIError } from '../middleware/errorHandler.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let queryString = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    let countString = `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id`;
    const params = [];

    if (category) {
      queryString += ' WHERE c.slug = $1';
      countString += ' WHERE c.slug = $1';
      params.push(category);
    }

    queryString += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const [result, countResult] = await Promise.all([
      query(queryString, [...params, limit, offset]),
      query(countString, params)
    ]);

    res.json({
      data: result.rows,
      meta: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.slug = $1
    `, [slug]);

    if (result.rows.length === 0) {
      throw new APIError('Product not found', 404);
    }

    const product = result.rows[0];

    // Log view asynchronously
    query(
      'INSERT INTO product_views (product_id, ip_address, user_agent) VALUES ($1, $2, $3)',
      [product.id, req.ip, req.get('User-Agent')]
    ).catch(err => console.error('Failed to log view:', err));

    res.json(product);
  } catch (err) {
    next(err);
  }
};
