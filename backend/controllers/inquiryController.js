import { query } from '../lib/db.js';

export const getAllInquiries = async (req, res) => {
  try {
    const result = await query(
      'SELECT i.*, p.name as product_name FROM inquiries i LEFT JOIN products p ON i.product_id = p.id ORDER BY i.created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const result = await query('SELECT COUNT(*) FROM inquiries WHERE is_read = FALSE');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createInquiry = async (req, res) => {
  const { productId, product_id, product, name, email, phone, company, quantity, message, source } = req.body;
  const finalProductId = productId || product_id;
  const finalProductName = product || null;
  const finalSource = source || 'direct';
  const ip_address = req.ip;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email are required' });
  }

  try {
    // Priority logic
    let priority = 'medium';
    const recentViews = await query(
      "SELECT COUNT(*) FROM events WHERE ip_address = $1 AND type = 'view' AND created_at > NOW() - INTERVAL '24 hours'",
      [ip_address]
    );
    const viewCount = parseInt(recentViews.rows[0].count);
    if (viewCount >= 3) {
      priority = 'high';
    }

    const result = await query(
      'INSERT INTO inquiries (product_id, product_name, name, email, phone, company, quantity, message, source, ip_address, priority) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [finalProductId, finalProductName, name, email, phone, company, quantity, message, finalSource, ip_address, priority]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInquiryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      'SELECT i.*, p.name as product_name, p.image_url as product_image FROM inquiries i LEFT JOIN products p ON i.product_id = p.id WHERE i.id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    const inquiry = result.rows[0];

    // Mark as read
    if (!inquiry.is_read) {
      await query('UPDATE inquiries SET is_read = TRUE WHERE id = $1', [id]);
    }

    // Get event history for this IP
    const events = await query(
      'SELECT * FROM events WHERE ip_address = $1 ORDER BY created_at DESC LIMIT 20',
      [inquiry.ip_address]
    );

    res.json({
      inquiry,
      history: events.rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateInquiryCRM = async (req, res) => {
  const { id } = req.params;
  const { status, priority, notes, assigned_to, mark_contacted } = req.body;
  
  try {
    let updateFields = [];
    let params = [id];
    let paramIdx = 2;

    if (status) {
      updateFields.push(`status = $${paramIdx++}`);
      params.push(status);
    }
    if (priority) {
      updateFields.push(`priority = $${paramIdx++}`);
      params.push(priority);
    }
    if (notes) {
      updateFields.push(`notes = $${paramIdx++}`);
      params.push(notes);
    }
    if (assigned_to) {
      updateFields.push(`assigned_to = $${paramIdx++}`);
      params.push(assigned_to);
    }
    if (mark_contacted) {
      updateFields.push(`last_contacted_at = CURRENT_TIMESTAMP`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const result = await query(
      `UPDATE inquiries SET ${updateFields.join(', ')} WHERE id = $1 RETURNING *`,
      params
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const exportCSV = async (req, res) => {
  try {
    const result = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
    const inquiries = result.rows;

    if (inquiries.length === 0) {
      return res.status(404).json({ message: 'No inquiries to export' });
    }

    const fields = Object.keys(inquiries[0]);
    const csvRows = [fields.join(',')];

    for (const row of inquiries) {
      const values = fields.map(field => {
        const val = row[field];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inquiries_export.csv');
    res.status(200).send(csvRows.join('\n'));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
