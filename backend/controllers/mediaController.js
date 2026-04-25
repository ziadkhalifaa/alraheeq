import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { query } from '../lib/db.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF, SVG are allowed.'));
    }
  }
}).single('file');

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directories exist
const ensureUploadsDirs = () => {
  const dirs = [
    UPLOADS_DIR,
    path.join(UPLOADS_DIR, 'general'),
    path.join(UPLOADS_DIR, 'products'),
    path.join(UPLOADS_DIR, 'blog')
  ];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
ensureUploadsDirs();

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'general';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    let finalFilename = `${timestamp}-${randomStr}`;
    let finalMimeType = 'image/webp';
    let outputBuffer;

    // We skip processing for SVG or GIF if desired, but let's process standard formats to WEBP
    if (req.file.mimetype === 'image/svg+xml' || req.file.mimetype === 'image/gif') {
      finalFilename += path.extname(req.file.originalname) || (req.file.mimetype === 'image/svg+xml' ? '.svg' : '.gif');
      finalMimeType = req.file.mimetype;
      outputBuffer = req.file.buffer;
    } else {
      finalFilename += '.webp';
      // Process with sharp
      let sharpInstance = sharp(req.file.buffer);
      
      // Get image metadata to check width
      const metadata = await sharpInstance.metadata();
      
      // Resize if width > 1920
      if (metadata.width && metadata.width > 1920) {
        sharpInstance = sharpInstance.resize({ width: 1920, withoutEnlargement: true });
      }

      // Convert to webp and compress
      outputBuffer = await sharpInstance
        .webp({ quality: 80, effort: 4 })
        .toBuffer();
    }

    const filePath = path.join(UPLOADS_DIR, folder, finalFilename);
    const fileUrl = `/uploads/${folder}/${finalFilename}`;

    // Save file locally
    await fsPromises.writeFile(filePath, outputBuffer);

    // Save to database
    const result = await query(
      `INSERT INTO media (filename, url, folder, size, mime_type)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [finalFilename, fileUrl, folder, outputBuffer.length, finalMimeType]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload and process image' });
  }
};

export const getAllMedia = async (req, res) => {
  try {
    const { folder } = req.query;
    let result;
    
    if (folder) {
      result = await query('SELECT * FROM media WHERE folder = $1 ORDER BY created_at DESC', [folder]);
    } else {
      result = await query('SELECT * FROM media ORDER BY created_at DESC');
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch Media Error:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get media record
    const result = await query('SELECT * FROM media WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    const media = result.rows[0];
    const filePath = path.join(UPLOADS_DIR, media.folder, media.filename);
    
    // Delete from filesystem
    try {
      await fsPromises.unlink(filePath);
    } catch (fsError) {
      console.warn('File not found on disk, continuing with db deletion:', fsError.message);
    }
    
    // Delete from db
    await query('DELETE FROM media WHERE id = $1', [id]);
    
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete Media Error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
};
