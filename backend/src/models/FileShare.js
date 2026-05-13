const mongoose = require('mongoose');

const fileShareSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true, // Speeds up lookups when user requests download/:token
    },
    originalName: {
      type: String,
      required: true,
    },
    storedName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true, // Helps the background cleanup service find expired files faster
    },
    downloadedAt: {
      type: Date,
      default: null, // Null means it hasn't been downloaded yet
    },
    isDeleted: {
      type: Boolean,
      default: false, // Flag to indicate if physical file is gone
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const FileShare = mongoose.model('FileShare', fileShareSchema);

module.exports = FileShare;
