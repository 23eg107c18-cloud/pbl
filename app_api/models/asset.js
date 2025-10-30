const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  filename: { type: String, required: true, trim: true },
  gridFsFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  mimeType: { type: String },
  size: { type: Number },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: { type: [String], default: [] },
  access: {
    type: String,
    enum: ['private','org','public'],
    default: 'private'
  },
  derived: { type: mongoose.Schema.Types.Mixed, default: {} },
  versions: [{
    fileId: { type: mongoose.Schema.Types.ObjectId },
    note: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

mongoose.model('Asset', assetSchema);
