var User = require('../models/user');
var mongoose = require('mongoose');
var passport = require('passport');

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.render('login', { user : req.user, layout:'mainlayout', message: req.flash('error'), });
};

// Post registration
userController.doSignup = passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/fail',
      failureFlash: true
});

// Go to login page
userController.login = function(req, res) {
  res.render('login' ,{ layout: 'mainlayout'});
};

// Post login
userController.doLogin = passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/users',
    failureFlash: true
});

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;