const express = require('express');
const router = express.Router();
const { downloadFile } = require('../controllers/downloadController');
const rateLimit = require('express-rate-limit');

// Prevent brute-forcing tokens
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 download requests per `window`
  message: 'Too many download attempts from this IP, please try again after 15 minutes.',
  standardHeaders: true, 
  legacyHeaders: false, 
});

// GET /api/download/:token
router.get('/:token', downloadLimiter, downloadFile);

module.exports = router;
