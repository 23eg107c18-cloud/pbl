require('dotenv').config();
const mongoose = require('mongoose');

require('./app_api/models/task');
const Task = mongoose.model('Task');

const dbURI = process.env.MONGO_URI || process.env.MONGO_LOCAL || 'mongodb://127.0.0.1:27017/wpm_scheduler';

(async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', dbURI);

    await Task.deleteMany({});
    console.log('Cleared tasks');

    await Task.create([
      { title: 'Database backup', description: 'Backup DB nightly', nextRun: new Date(Date.now() + 3600*1000), interval: '24h' },
      { title: 'Send report', description: 'Email weekly report', nextRun: new Date(Date.now() + 2*3600*1000), interval: '7d' },
      { title: 'Cleanup temp files', description: 'Remove old temp files', nextRun: new Date(Date.now() + 30*60*1000), interval: '3600s' }
    ]);

    console.log('Seeded tasks');
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
})();
