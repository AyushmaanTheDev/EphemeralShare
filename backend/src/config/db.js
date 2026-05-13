// ─────────────────────────────────────────────────────────────────────────────
// config/db.js
// Connects to MongoDB using Mongoose.
// Called once at server startup — all Mongoose models use this shared connection.
// ─────────────────────────────────────────────────────────────────────────────
const mongoose = require('mongoose');

/**
 * connectDB — opens a Mongoose connection to MongoDB.
 * Reads MONGO_URI from environment variables.
 * Exits the process on failure so the server never starts in a broken state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Exit with failure code — no point running without a database
    process.exit(1);
  }
};

module.exports = connectDB;
