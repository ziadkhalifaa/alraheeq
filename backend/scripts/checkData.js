
import 'dotenv/config';
import { query } from '../lib/db.js';

async function checkInquiries() {
  try {
    const result = await query('SELECT * FROM inquiries');
    console.log('Inquiries count:', result.rows.length);
    console.log('Inquiries sample:', result.rows.slice(0, 2));
  } catch (err) {
    console.error('Error checking inquiries:', err);
  }
}

checkInquiries();
