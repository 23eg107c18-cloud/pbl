/* Simple pages controller */
const about = (req, res) => {
  res.render('about', { title: 'About' });
};

const contact = (req, res) => {
  res.render('contact', { title: 'Contact' });
};

const registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

const registerSubmit = (req, res) => {
  // Demo: do not store credentials. Just show confirmation.
  res.render('register-success', { title: 'Registered', name: req.body.name || 'User' });
};

module.exports = { about, contact, registerForm, registerSubmit };
