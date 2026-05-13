const FileShare = require('../models/FileShare');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Handle file upload, save metadata to DB, and return unique link
 * @route   POST /api/upload
 * @access  Public
 */
const uploadFile = async (req, res, next) => {
  try {
    // 1. Ensure file was actually uploaded by Multer
    if (!req.file) {
      const error = new Error('Please upload a file');
      error.statusCode = 400;
      throw error;
    }

    // 2. Extract configuration (TTL)
    const fileTtlMs = parseInt(process.env.FILE_TTL_MS || 86400000, 10); // Default 24h

    // 3. Generate unique download token
    const token = generateToken();

    // 4. Create metadata record in MongoDB
    const newFileShare = new FileShare({
      token: token,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      expiresAt: new Date(Date.now() + fileTtlMs),
    });

    await newFileShare.save();

    // 5. Construct the shareable URL
    // In dev: http://localhost:5173/download/:token
    const baseUrl = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`;
    const shareUrl = `${baseUrl}/download/${token}`;

    // 6. Send success response
    res.status(201).json({
      success: true,
      data: {
        token,
        originalName: newFileShare.originalName,
        size: newFileShare.size,
        expiresAt: newFileShare.expiresAt,
        shareUrl,
      },
    });
  } catch (error) {
    // If anything fails here (like DB save), Multer already saved the file to disk.
    // We should ideally clean it up, but for now our background cleanup service 
    // will eventually catch orphaned files if we expand it to check disk vs DB.
    next(error); // Pass to global error handler
  }
};

module.exports = {
  uploadFile,
};
