const path = require('path');
const fs = require('fs');
const FileShare = require('../models/FileShare');

/**
 * @desc    Get file metadata and stream the file for download. Marks as downloaded.
 * @route   GET /api/download/:token
 * @access  Public
 */
const downloadFile = async (req, res, next) => {
  try {
    const { token } = req.params;

    // 1. Find file metadata by token
    const fileShare = await FileShare.findOne({ token });

    // 2. Validate existence
    if (!fileShare) {
      const error = new Error('Link is invalid or has expired.');
      error.statusCode = 404;
      throw error;
    }

    // 3. Check if physical file was already deleted (by background job)
    if (fileShare.isDeleted) {
      const error = new Error('This file has expired and been deleted.');
      error.statusCode = 410; // 410 Gone is semantically correct
      throw error;
    }

    // 4. Check one-time access logic (Already downloaded)
    if (fileShare.downloadedAt !== null) {
      const error = new Error('This file has already been downloaded and is no longer available.');
      error.statusCode = 410;
      throw error;
    }

    // 5. Check time-based expiry logic
    if (new Date() > fileShare.expiresAt) {
      const error = new Error('This link has expired.');
      error.statusCode = 410;
      throw error;
    }

    // 6. Path to the physical file
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const filePath = path.join(__dirname, '../../', uploadDir, fileShare.storedName);

    if (!fs.existsSync(filePath)) {
      // DB says it exists, but file is missing from disk (data inconsistency)
      const error = new Error('File not found on server.');
      error.statusCode = 404;
      throw error;
    }

    // 7. Mark as downloaded *before* streaming starts to prevent concurrent downloads
    fileShare.downloadedAt = new Date();
    await fileShare.save();

    // 8. Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileShare.originalName}"`);
    res.setHeader('Content-Type', fileShare.mimeType);
    res.setHeader('Content-Length', fileShare.size);

    // 9. Stream the file directly to the response (efficient for large files)
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.pipe(res);

    // 10. Once the stream is done, delete the file from disk (One-time download logic completion)
    fileStream.on('end', async () => {
      try {
        fs.unlinkSync(filePath); // Delete physical file
        
        // Update DB to reflect physical deletion
        fileShare.isDeleted = true;
        await fileShare.save();
        
        console.log(`[Download] File ${fileShare.originalName} downloaded and deleted.`);
      } catch (err) {
        console.error(`[Error] Failed to delete file ${filePath} after download:`, err);
      }
    });

    fileStream.on('error', (err) => {
      console.error(`[Error] Stream error for file ${filePath}:`, err);
      if (!res.headersSent) {
        next(err);
      } else {
        res.end(); // Close connection if stream fails mid-way
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  downloadFile,
};
