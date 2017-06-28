var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('./layouts/admin', { title: 'Admin Page' });
});

router.get('/list-product', function(req, res, next) {
    res.render('list-product-admin', { title: 'Admin Page', layout: 'admin'});
});


module.exports = router;