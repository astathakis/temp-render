const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router
  .route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.register));

//passport magic use authenticate middleware

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
      //this is needed to store session originalurl
      keepSessionInfo: true,
    }),
    users.login
  );

//can have multiple strategies defined in different routes

//log out user
router.get('/logout', users.logout);

module.exports = router;
