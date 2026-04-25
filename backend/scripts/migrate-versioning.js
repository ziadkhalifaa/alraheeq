import { query } from '../lib/db.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

async function migrate() {
  console.log('🚀 Starting versioning system migration...');

  try {
    // 1. Create the new page_content_versions table
    await query(`
      CREATE TABLE IF NOT EXISTS page_content_versions (
        id SERIAL PRIMARY KEY,
        page_slug VARCHAR(255) NOT NULL,
        content_key VARCHAR(255) NOT NULL,
        value_json JSONB NOT NULL,
        language VARCHAR(10) NOT NULL,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        version INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT NOW(),
        created_by VARCHAR(255)
      );
    `);
    console.log('✅ Created table page_content_versions');

    // 2. Create indexes for performance
    await query(`CREATE INDEX IF NOT EXISTS idx_page_versions_slug_key ON page_content_versions (page_slug, content_key);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_page_versions_status ON page_content_versions (status);`);
    console.log('✅ Created indexes');

    // 3. Migrate existing data if table page_content exists
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'page_content'
      );
    `);

    if (tableExists.rows[0].exists) {
      console.log('📦 Migrating existing content to versions table...');
      await query(`
        INSERT INTO page_content_versions (page_slug, content_key, value_json, language, status, version)
        SELECT page_slug, content_key, value, 'en', 'published', 1
        FROM page_content
        ON CONFLICT DO NOTHING;
      `);
      console.log('✅ Data migration complete');
    }

    console.log('✨ Migration finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

migrate();
