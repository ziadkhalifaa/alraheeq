import { query } from '../lib/db.js';

async function check() {
  try {
    const res = await query(`
      SELECT * FROM page_content_versions 
      WHERE content_key = 'home.categories.c4Img' 
      ORDER BY version DESC LIMIT 5
    `);
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
