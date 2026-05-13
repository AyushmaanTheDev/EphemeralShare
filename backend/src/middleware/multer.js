const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Storage Configuration
// Define where to store files and what to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store in the configured uploads directory
  },
  filename: (req, file, cb) => {
    // Generate a random string + current timestamp to guarantee unique filenames on disk
    // We don't use original name on disk for security (avoids path traversal and weird chars)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// 2. File Filter (Security)
// We block common executable file extensions to prevent malicious uploads
const fileFilter = (req, file, cb) => {
  const blockedExtensions = ['.exe', '.sh', '.bat', '.msi', '.cmd', '.vbs', '.php', '.pl', '.cgi'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (blockedExtensions.includes(ext)) {
    // Reject the file
    const error = new Error(`File type ${ext} is not allowed for security reasons.`);
    error.statusCode = 400;
    return cb(error, false);
  }
  
  // Accept the file
  cb(null, true);
};

// 3. Multer Instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // 50 MB limit as per our plan. 
    // This stops denial-of-service (DoS) attacks via massive files.
    fileSize: 50 * 1024 * 1024, 
  },
});

module.exports = upload;
