var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('contact-us', { title: 'Contact Us' });
});

module.exports = router;