const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { uploadFile } = require('../controllers/uploadController');

// POST /api/upload
// 1. multer processes 'file' field, validates size/type, saves to disk
// 2. uploadController saves metadata to DB and returns token
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
