import { query } from '../lib/db.js';

async function addConstraint() {
  try {
    await query("ALTER TABLE page_content ADD CONSTRAINT page_content_slug_key_unique UNIQUE (page_slug, content_key)");
    console.log("Constraint added.");
  } catch(e) {
    console.log(e.message);
  }
  process.exit(0);
}
addConstraint();
