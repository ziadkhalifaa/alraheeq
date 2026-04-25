import cloudinary from '../lib/cloudinary.js';
import { APIError } from '../middleware/errorHandler.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new APIError('No file uploaded', 400);
    }

    // Convert buffer to base64
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'alraheeq/products',
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    next(err);
  }
};
