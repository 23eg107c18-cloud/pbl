const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');

const showRegister = (req, res) => res.render('register', { title: 'Register' });

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.render('register', { title: 'Register', error: 'All fields required' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.render('register', { title: 'Register', error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), passwordHash: hash });
    req.session.userId = user._id;
    return res.redirect('/');
  } catch (err) {
    console.error('Register error', err);
    return res.render('register', { title: 'Register', error: 'Error registering' });
  }
};

const showSignin = (req, res) => res.render('signin', { title: 'Sign In' });

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.render('signin', { title: 'Sign In', error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.render('signin', { title: 'Sign In', error: 'Invalid credentials' });
    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    console.error('Sign in error', err);
    res.render('signin', { title: 'Sign In', error: 'Error signing in' });
  }
};

const signout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

module.exports = { showRegister, register, showSignin, signin, signout };
