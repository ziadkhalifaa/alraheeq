import bcrypt from 'bcrypt';
import crypto from 'crypto';
import pool from '../lib/db.js';

const seed = async () => {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || crypto.randomBytes(12).toString('hex');
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await pool.query(
      'INSERT INTO admins (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET password = $2',
      [username, hashedPassword, 'admin']
    );
    console.log('------------------------------------------');
    console.log('✅ Admin user seeded/updated successfully');
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log('------------------------------------------');
    console.log('⚠️ IMPORTANT: Save this password! It will not be shown again.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin user:', err);
    process.exit(1);
  }
};

seed();
