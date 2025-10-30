const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');
require('dotenv').config();

const dbURI = process.env.MONGO_URI || process.env.MONGO_LOCAL || 'mongodb://127.0.0.1:27017/wpm_scheduler';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Mongoose connected to ${dbURI}`))
  .catch(err => console.error('Mongoose connection error:', err));

mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// GridFS bucket for asset storage (lazy-initialized when connection is open)
let gfsBucket = null;
const ensureGridFS = () => {
  if (gfsBucket) return gfsBucket;
  if (mongoose.connection && mongoose.connection.db) {
    gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'assets' });
    console.log('GridFSBucket (assets) initialized');
    return gfsBucket;
  }
  return null;
};

// initialize if already open
mongoose.connection.once('open', () => { ensureGridFS(); });

const gracefulShutdown = async (msg, callback) => {
  try {
    await mongoose.connection.close();
    console.log(`Mongoose disconnected through ${msg}`);
  } catch (err) {
    console.error('Error during mongoose disconnect:', err);
  }
  if (typeof callback === 'function') callback();
};

process.once('SIGUSR2', () => gracefulShutdown('nodemon restart', () => process.kill(process.pid, 'SIGUSR2')));
process.on('SIGINT', () => gracefulShutdown('app termination', () => process.exit(0)));
process.on('SIGTERM', () => gracefulShutdown('app shutdown', () => process.exit(0)));

// Load models
require('./task');
require('./user');
require('./asset');

module.exports = {
  mongoose,
  getGridFSBucket: ensureGridFS,
  ObjectId
};
