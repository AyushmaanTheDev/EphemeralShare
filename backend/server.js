require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Route Imports
const uploadRoutes = require('./src/routes/upload');
const downloadRoutes = require('./src/routes/download');

// Services
const { startCleanupJob } = require('./src/services/cleanupService');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Start Background Jobs
startCleanupJob();

// ─── Middleware ──────────────────────────────────────────
// HTTP Security Headers
app.use(helmet());

// CORS configuration - allowing requests from frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
}));

// Parse JSON bodies (though Multer handles multipart for file uploads)
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────
// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Feature Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/download', downloadRoutes);

// Handle undefined routes (404)
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ─── Error Handling ──────────────────────────────────────
// Must be after all routes
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
