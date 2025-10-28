const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || process.env.MONGO_LOCAL || 'mongodb://127.0.0.1:27017/wpm_scheduler';

(async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const filesColl = db.collection('assets.files');
    const count = await filesColl.countDocuments();
    console.log('assets.files count:', count);
    if (count > 0) {
      const docs = await filesColl.find().limit(5).toArray();
      console.log('sample files:', JSON.stringify(docs, null, 2));
    }
    await client.close();
  } catch (err) {
    console.error('Error checking GridFS:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
