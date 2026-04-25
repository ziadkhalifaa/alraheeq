import { query } from '../lib/db.js';

export const getOverviewStats = async (req, res) => {
  try {
    // 1. Total Views (from events and product_views)
    const viewsResult = await query(`
      SELECT COUNT(*) FROM events WHERE type = 'view'
    `);
    const legacyViewsResult = await query(`SELECT COUNT(*) FROM product_views`);
    const totalViews = parseInt(viewsResult.rows[0].count) + parseInt(legacyViewsResult.rows[0].count);

    // 2. Total Inquiries
    const inquiriesResult = await query(`SELECT COUNT(*) FROM inquiries`);
    const totalInquiries = parseInt(inquiriesResult.rows[0].count);

    // 3. Conversion Rate
    const conversionRate = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;

    // 4. Most Viewed Products
    const mostViewedResult = await query(`
      SELECT p.id, p.name, COUNT(e.id) as views
      FROM products p
      LEFT JOIN events e ON p.id = e.product_id AND e.type = 'view'
      GROUP BY p.id, p.name
      ORDER BY views DESC
      LIMIT 5
    `);

    // 5. Inquiries by Source
    const sourceStats = await query(`
      SELECT source, COUNT(*) as count
      FROM inquiries
      GROUP BY source
    `);

    // 6. Recent Events (last 10)
    const recentEvents = await query(`
      SELECT e.*, p.name as product_name
      FROM events e
      LEFT JOIN products p ON e.product_id = p.id
      ORDER BY e.created_at DESC
      LIMIT 10
    `);

    res.json({
      overview: {
        totalViews,
        totalInquiries,
        conversionRate: conversionRate.toFixed(2),
      },
      mostViewed: mostViewedResult.rows,
      sources: sourceStats.rows,
      recentEvents: recentEvents.rows
    });
  } catch (err) {
    console.error('Analytics stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProductPerformance = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        p.id, 
        p.name, 
        p.slug,
        (SELECT COUNT(*) FROM events e WHERE e.product_id = p.id AND e.type = 'view') + 
        (SELECT COUNT(*) FROM product_views pv WHERE pv.product_id = p.id) as total_views,
        (SELECT COUNT(*) FROM inquiries i WHERE i.product_id = p.id) as total_inquiries,
        (SELECT COUNT(*) FROM events e WHERE e.product_id = p.id AND e.type = 'click_whatsapp') as whatsapp_clicks
      FROM products p
      ORDER BY total_views DESC
    `);

    // Add performance indicator
    const processed = result.rows.map(row => {
      const convRate = row.total_views > 0 ? (row.total_inquiries / row.total_views) : 0;
      let indicator = 'low';
      if (convRate > 0.05) indicator = 'high';
      else if (convRate > 0.02) indicator = 'medium';
      
      return { ...row, conversion_rate: (convRate * 100).toFixed(2), performance: indicator };
    });

    res.json(processed);
  } catch (err) {
    console.error('Product performance error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
