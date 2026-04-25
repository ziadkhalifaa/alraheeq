import { query } from '../lib/db.js';

export const logEvent = async (req, res) => {
  const { type, product_id, source_page } = req.body;
  const user_agent = req.get('User-Agent');
  const ip_address = req.ip;

  try {
    await query(
      'INSERT INTO events (type, product_id, source_page, user_agent, ip_address) VALUES ($1, $2, $3, $4, $5)',
      [type, product_id || null, source_page || null, user_agent, ip_address]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Event log error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
