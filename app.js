require('dotenv').config();
require('./app_api/models/db');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const apiRoutes = require('./app_api/routes/index');
const webRoutes = require('./app_server/routes/index');

const app = express();

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));

// expose currentUser to templates (user id only)
const mongoose = require('mongoose');
app.use(async (req, res, next) => {
  res.locals.currentUser = null;
  try {
    if (req.session && req.session.userId) {
      const User = mongoose.model('User');
      const user = await User.findById(req.session.userId).select('name email').lean();
      if (user) res.locals.currentUser = user;
    }
  } catch (err) {
    console.error('Error loading current user', err);
  }
  next();
});

app.use('/api', apiRoutes);
app.use('/', webRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found', error: {} });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', { message: err.message, error: err });
});

module.exports = app;
