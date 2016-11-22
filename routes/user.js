var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var csrfProtection = csrf();
var Game = require('../models/games');


router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
 res.render('user/profile', {user: req.user});
});

router.get('/dashboard', isLoggedInAsAdmin, function(req, res, next) {
 res.render('user/dashboard', {user: req.user});
});


// {user: req.user}
router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));


router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

router.get('/logout', function(req, res, next) {
  console.log(req.user);
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});

router.use('/', notLoggedIn, function(req, res, next) {
  next();
});



module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function isLoggedInAsAdmin(req, res, next) {
  console.log("another");
  if (req.isAuthenticated() && req.user.admin)  {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
