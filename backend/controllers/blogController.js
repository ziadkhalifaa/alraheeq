
import { query } from '../lib/db.js';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const sanitizeBlocks = (content) => {
  if (typeof content === 'string') return purify.sanitize(content);
  if (Array.isArray(content)) return content.map(sanitizeBlocks);
  if (content && typeof content === 'object') {
    const sanitized = {};
    for (const key in content) {
      sanitized[key] = sanitizeBlocks(content[key]);
    }
    return sanitized;
  }
  return content;
};

export const getAllPosts = async (req, res) => {
  try {
    const result = await query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await query('SELECT * FROM blogs WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPost = async (req, res) => {
  const { title, content, slug, image_url, excerpt, author, status, metaTitle, metaDescription } = req.body;
  
  if (!title?.en || !content || !slug) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const cleanContent = sanitizeBlocks(content);

  try {
    const result = await query(
      'INSERT INTO blogs (title, content, slug, image_url, excerpt, author, status, meta_title, meta_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        JSON.stringify(title), 
        JSON.stringify(cleanContent), 
        slug, 
        image_url, 
        JSON.stringify(excerpt || { en: '', ar: '' }),
        author || 'Alraheeq',
        status || 'published',
        JSON.stringify(metaTitle || { en: '', ar: '' }),
        JSON.stringify(metaDescription || { en: '', ar: '' })
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, slug, image_url, excerpt, author, status, metaTitle, metaDescription } = req.body;
  
  if (!title?.en || !content || !slug) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const cleanContent = sanitizeBlocks(content);

  try {
    const result = await query(
      'UPDATE blogs SET title = $1, content = $2, slug = $3, image_url = $4, excerpt = $5, author = $6, status = $7, meta_title = $8, meta_description = $9 WHERE id = $10 RETURNING *',
      [
        JSON.stringify(title), 
        JSON.stringify(cleanContent), 
        slug, 
        image_url, 
        JSON.stringify(excerpt || { en: '', ar: '' }),
        author || 'Alraheeq',
        status || 'published',
        JSON.stringify(metaTitle || { en: '', ar: '' }),
        JSON.stringify(metaDescription || { en: '', ar: '' }),
        id
      ]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM blogs WHERE id = $1', [id]);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Blog error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
