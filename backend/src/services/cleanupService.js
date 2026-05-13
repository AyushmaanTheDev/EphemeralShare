const fs = require('fs');
const path = require('path');
const FileShare = require('../models/FileShare');

/**
 * Cleanup Service
 * Runs periodically to find files that have expired (TTL reached)
 * but were never downloaded, and deletes them from disk.
 */
const startCleanupJob = () => {
  // Run every 30 minutes
  const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; 

  console.log(`🧹 Background cleanup service started. Running every ${CLEANUP_INTERVAL_MS / 60000} minutes.`);

  setInterval(async () => {
    try {
      // Find files where expiresAt is in the past AND isDeleted is still false
      const expiredFiles = await FileShare.find({
        expiresAt: { $lt: new Date() },
        isDeleted: false,
      });

      if (expiredFiles.length === 0) return;

      console.log(`[Cleanup] Found ${expiredFiles.length} expired files to purge.`);

      const uploadDir = process.env.UPLOAD_DIR || 'uploads';
      
      for (const file of expiredFiles) {
        const filePath = path.join(__dirname, '../../', uploadDir, file.storedName);

        // Delete physical file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Update DB
        file.isDeleted = true;
        await file.save();

        console.log(`[Cleanup] Deleted expired file: ${file.originalName}`);
      }
    } catch (error) {
      console.error('[Cleanup Error] Failed to run cleanup job:', error);
    }
  }, CLEANUP_INTERVAL_MS);
};

module.exports = {
  startCleanupJob,
};
