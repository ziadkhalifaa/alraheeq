import { query } from '../lib/db.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function check() {
  try {
    const tableCheck = await query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'page_content_versions')");
    console.log('Table page_content_versions exists:', tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      const columns = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'page_content_versions'");
      console.log('Columns:', columns.rows);
      
      const rowCount = await query("SELECT count(*) FROM page_content_versions");
      console.log('Row count:', rowCount.rows[0].count);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
