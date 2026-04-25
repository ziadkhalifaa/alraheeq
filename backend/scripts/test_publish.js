import { query } from '../lib/db.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testPublish() {
  const slug = 'home';
  try {
    const latestContent = await query(`
      SELECT DISTINCT ON (content_key) content_key, value_json, language, version
      FROM page_content_versions
      WHERE page_slug = $1
      ORDER BY content_key, version DESC
    `, [slug]);

    console.log('Latest content count for home:', latestContent.rows.length);

    if (latestContent.rows.length === 0) {
      console.log('❌ No content found to publish');
      return;
    }

    const publishPromises = latestContent.rows.map(async (row) => {
      return query(
        `INSERT INTO page_content_versions (page_slug, content_key, value_json, language, status, version)
         VALUES ($1, $2, $3, $4, 'published', $5)`,
        [slug, row.content_key, row.value_json, row.language, row.version + 1]
      );
    });

    await Promise.all(publishPromises);
    console.log('✅ Publish successful');
  } catch (err) {
    console.error('❌ Publish failed:', err);
  }
  process.exit(0);
}

testPublish();
