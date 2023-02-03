const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    //login user as soon as is registered - minor
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    });
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('register');
  }
  // console.log(registeredUser);
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.flash('success', 'welcome back!');
  //also possible to have returnedTo with nothing
  // console.log(req.session.returnTo);
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'successfully logged out!!!');
    res.redirect('/campgrounds');
  });
};
