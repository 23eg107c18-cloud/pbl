const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  nextRun: { type: Date, default: null },
  interval: { type: String, default: null }, // freeform: 'daily', '3600s', or cron-like
  status: { type: String, enum: ['scheduled','running','paused','completed'], default: 'scheduled' },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

mongoose.model('Task', taskSchema);
