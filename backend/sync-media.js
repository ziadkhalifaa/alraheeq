import pg from 'pg';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import axios from 'axios';

const { Pool } = pg;
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'alraheeq'
});

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'general');

async function downloadAndProcessImage(url) {
  try {
    if (!url || !url.startsWith('http')) return null;
    
    // Check if it already exists in media table by URL
    const existing = await pool.query('SELECT * FROM media WHERE url = $1', [url]);
    if (existing.rows.length > 0) return null;

    console.log(`Downloading: ${url}`);
    
    // Download image
    const response = await axios({
      url,
      responseType: 'arraybuffer',
      timeout: 10000,
    });
    
    const buffer = Buffer.from(response.data);
    
    // Process with sharp
    let sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();
    
    if (metadata.width && metadata.width > 1920) {
      sharpInstance = sharpInstance.resize({ width: 1920, withoutEnlargement: true });
    }
    
    const outputBuffer = await sharpInstance
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
      
    // Save to disk
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const finalFilename = `${timestamp}-${randomStr}.webp`;
    const filePath = path.join(UPLOADS_DIR, finalFilename);
    const fileUrl = `/uploads/general/${finalFilename}`;
    
    fs.writeFileSync(filePath, outputBuffer);
    
    // Insert into DB
    const result = await pool.query(
      `INSERT INTO media (filename, url, folder, size, mime_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [finalFilename, fileUrl, 'general', outputBuffer.length, 'image/webp']
    );
    
    console.log(`Saved as ${finalFilename}`);
    return result.rows[0];
  } catch (error) {
    console.error(`Failed to process ${url}:`, error.message);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const urls = new Set();
  
  // 1. Products
  const products = await pool.query('SELECT image_url, images FROM products');
  products.rows.forEach(p => {
    if (p.image_url) urls.add(p.image_url);
    if (p.images && Array.isArray(p.images)) {
      p.images.forEach(img => urls.add(img));
    }
  });
  
  // 2. Categories
  try {
    const categories = await pool.query('SELECT image_url FROM categories');
    categories.rows.forEach(c => {
      if (c.image_url) urls.add(c.image_url);
    });
  } catch (e) { console.log('Skipping categories image_url:', e.message); }
  
  // 3. Certificates
  try {
    const certificates = await pool.query('SELECT file_url FROM certificates');
    certificates.rows.forEach(c => {
      if (c.file_url) urls.add(c.file_url);
    });
  } catch (e) { console.log('Skipping certificates file_url:', e.message); }
  
  // 4. Blog Posts
  try {
    const blogPosts = await pool.query('SELECT metadata FROM blog_posts');
    blogPosts.rows.forEach(b => {
      if (b.metadata && b.metadata.image_url) {
        urls.add(b.metadata.image_url);
      }
    });
  } catch (e) {
    try {
      const blogs = await pool.query('SELECT metadata FROM posts');
      blogs.rows.forEach(b => {
        if (b.metadata && b.metadata.image_url) {
          urls.add(b.metadata.image_url);
        }
      });
    } catch (e2) {
      console.log('Skipping blog posts:', e2.message);
    }
  }

  console.log(`Found ${urls.size} unique URLs in the database.`);
  
  const urlArray = Array.from(urls);
  for (let i = 0; i < urlArray.length; i++) {
    console.log(`Processing ${i + 1}/${urlArray.length}`);
    await downloadAndProcessImage(urlArray[i]);
  }
  
  console.log('Migration completed.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
