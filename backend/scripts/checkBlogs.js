
import 'dotenv/config';
import { query } from '../lib/db.js';

async function checkBlogs() {
  try {
    const result = await query('SELECT * FROM blogs');
    console.log('Blogs count:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('Blog sample title type:', typeof result.rows[0].title);
      console.log('Blog sample title:', result.rows[0].title);
    }
  } catch (err) {
    console.error('Error checking blogs:', err);
  }
}

checkBlogs();
