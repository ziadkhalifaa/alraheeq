import { query } from '../lib/db.js';

export const getAllCertificates = async (req, res) => {
  try {
    const result = await query('SELECT * FROM certificates ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCertificate = async (req, res) => {
  const { title, image_url, description } = req.body;
  
  if (!title?.en || !image_url) {
    return res.status(400).json({ error: 'Title and image URL are required' });
  }

  try {
    const result = await query(
      'INSERT INTO certificates (title, image_url, description) VALUES ($1, $2, $3) RETURNING *',
      [JSON.stringify(title), image_url, JSON.stringify(description)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Certificate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateCertificate = async (req, res) => {
  const { id } = req.params;
  const { title, image_url, description } = req.body;
  
  if (!title?.en || !image_url) {
    return res.status(400).json({ error: 'Title and image URL are required' });
  }

  try {
    const result = await query(
      'UPDATE certificates SET title = $1, image_url = $2, description = $3 WHERE id = $4 RETURNING *',
      [JSON.stringify(title), image_url, JSON.stringify(description), id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Certificate not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Certificate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM certificates WHERE id = $1', [id]);
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    console.error('Certificate error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
