// import_to_db.js
// Inserts sample users and tasks into the project's MongoDB using Mongoose/models.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const dbURI = process.env.MONGO_URI || process.env.MONGO_LOCAL || 'mongodb://127.0.0.1:27017/wpm_scheduler';

(async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('Connected to', dbURI);

    // load models
    require('./app_api/models/task');
    require('./app_api/models/user');
    const Task = mongoose.model('Task');
    const User = mongoose.model('User');

    // clear existing sample data (only for demo)
    await Task.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared tasks and users');

    // create users
    const usersData = [
      { name: 'Alice Example', email: 'alice@example.com', password: 'password1' },
      { name: 'Bob Example', email: 'bob@example.com', password: 'password2' }
    ];

    const createdUsers = [];
    for (const u of usersData) {
      const hash = await bcrypt.hash(u.password, 10);
      const user = await User.create({ name: u.name, email: u.email.toLowerCase(), passwordHash: hash });
      createdUsers.push(user);
      console.log('Created user', user.email);
    }

    // create tasks for each user
    const now = new Date();
    const tasksData = [
      {
        owner: createdUsers[0]._id,
        title: 'Database backup',
        description: 'Backup DB nightly',
        nextRun: new Date(now.getTime() + 3600 * 1000),
        interval: '24h'
      },
      {
        owner: createdUsers[0]._id,
        title: 'Send report',
        description: 'Email weekly report',
        nextRun: new Date(now.getTime() + 2 * 3600 * 1000),
        interval: '7d'
      },
      {
        owner: createdUsers[1]._id,
        title: 'Cleanup temp files',
        description: 'Remove old temp files',
        nextRun: new Date(now.getTime() + 30 * 60 * 1000),
        interval: '3600s'
      }
    ];

    await Task.create(tasksData);
    console.log('Inserted sample tasks');

  } catch (err) {
    console.error('Import error', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
})();
