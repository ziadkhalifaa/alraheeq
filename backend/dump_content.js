import { query } from './lib/db.js';

async function check() {
  try {
    const res = await query(`
      SELECT page_slug, content_key, value_json, status, version 
      FROM page_content_versions 
      ORDER BY page_slug, content_key, version DESC
    `);
    
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
