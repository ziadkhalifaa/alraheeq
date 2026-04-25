import { query } from '../lib/db.js';

export const getPageContent = async (req, res) => {
  try {
    const { slug } = req.params;
    const { mode = 'published' } = req.query; // 'draft' or 'published'
    
    // 1. Get the page metadata
    const pageResult = await query('SELECT * FROM pages WHERE slug = $1', [slug]);
    
    // 2. Get latest content based on mode
    // If mode is draft: get the latest version (could be draft or published)
    // If mode is published: get the latest version where status = 'published'
    
    let contentQuery = '';
    let queryParams = [slug];

    if (mode === 'draft') {
      // Get the latest version for each key, preferring drafts if they are newer
      contentQuery = `
        SELECT DISTINCT ON (content_key) content_key, value_json as value, status, version
        FROM page_content_versions
        WHERE page_slug = $1
        ORDER BY content_key, version DESC
      `;
    } else {
      // Get the latest published version for each key
      contentQuery = `
        SELECT DISTINCT ON (content_key) content_key, value_json as value, status, version
        FROM page_content_versions
        WHERE page_slug = $1 AND status = 'published'
        ORDER BY content_key, version DESC
      `;
    }

    const contentResult = await query(contentQuery, queryParams);
    
    const contentDict = {};
    contentResult.rows.forEach(row => {
      contentDict[row.content_key] = row.value;
    });

    res.json({
      page: pageResult.rows[0] || null,
      content: contentDict,
      mode
    });
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
};

export const updatePageContent = async (req, res) => {
  try {
    const { slug } = req.params;
    const { content_key, value, language = 'en' } = req.body;

    console.log(`[Update] Slug: ${slug}, Key: ${content_key}, Language: ${language}`);
    console.log(`[Update] Value:`, value);

    if (!content_key || value === undefined) {
      return res.status(400).json({ error: 'Missing content_key or value' });
    }

    // 1. Get the latest version number
    const versionRes = await query(
      'SELECT MAX(version) as last_version FROM page_content_versions WHERE page_slug = $1 AND content_key = $2',
      [slug, content_key]
    );
    const nextVersion = (versionRes.rows[0].last_version || 0) + 1;

    // 2. Insert new draft version
    const result = await query(
      `INSERT INTO page_content_versions (page_slug, content_key, value_json, language, status, version)
       VALUES ($1, $2, $3, $4, 'draft', $5)
       RETURNING *`,
      [slug, content_key, value, language, nextVersion]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating page content:', error);
    res.status(500).json({ error: 'Failed to update page content' });
  }
};

export const publishPageContent = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Get latest draft or published version for all keys in this slug
    const latestContent = await query(`
      SELECT DISTINCT ON (content_key) content_key, value_json, language, version
      FROM page_content_versions
      WHERE page_slug = $1
      ORDER BY content_key, version DESC
    `, [slug]);

    if (latestContent.rows.length === 0) {
      return res.status(404).json({ error: 'No content found to publish' });
    }

    // 2. For each key, insert a new "published" version
    const publishPromises = latestContent.rows.map(async (row) => {
      // Check if the latest is already published, if so skip to save rows? 
      // User rules say "ALWAYS insert new version rows" on publish logic.
      
      return query(
        `INSERT INTO page_content_versions (page_slug, content_key, value_json, language, status, version)
         VALUES ($1, $2, $3, $4, 'published', $5)`,
        [slug, row.content_key, row.value_json, row.language, row.version + 1]
      );
    });

    await Promise.all(publishPromises);

    res.json({ message: 'Page published successfully', count: latestContent.rows.length });
  } catch (error) {
    console.error('Error publishing page content:', error);
    res.status(500).json({ error: 'Failed to publish page content' });
  }
};

export const getAllPages = async (req, res) => {
  try {
    const result = await query('SELECT * FROM pages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

export const createPage = async (req, res) => {
  try {
    const { title, slug, meta_description } = req.body;
    
    // Convert string inputs to JSON objects for the database
    const titleObj = typeof title === 'string' ? { en: title, ar: title } : title;
    const metaObj = typeof meta_description === 'string' ? { en: meta_description, ar: meta_description } : (meta_description || { en: '', ar: '' });

    const result = await query(
      `INSERT INTO pages (title, slug, meta_description, sections, created_at, updated_at)
       VALUES ($1, $2, $3, '[]'::jsonb, NOW(), NOW())
       RETURNING *`,
      [titleObj, slug, metaObj]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Failed to create page' });
  }
};

export const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pageRes = await query('SELECT slug FROM pages WHERE id = $1', [id]);
    if (pageRes.rows.length > 0) {
      const slug = pageRes.rows[0].slug;
      await query('DELETE FROM page_content_versions WHERE page_slug = $1', [slug]);
    }
    
    await query('DELETE FROM pages WHERE id = $1', [id]);
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Failed to delete page' });
  }
};
