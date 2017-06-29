var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page', user:req.user, layout: 'mainlayout' });
});

module.exports = router;

