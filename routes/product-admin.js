var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('admin/list-product-admin', { title: 'Admin Page', layout: "admin" });
});

module.exports = router;