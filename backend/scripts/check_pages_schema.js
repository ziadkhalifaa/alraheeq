import { query } from '../lib/db.js';

async function check() {
  try {
    const pages = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pages'");
    console.log('pages:', pages.rows);
    
    const page_sections = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'page_sections'");
    console.log('page_sections:', page_sections.rows);

    const page_content = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'page_content'");
    console.log('page_content:', page_content.rows);
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
