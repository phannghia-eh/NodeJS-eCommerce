var express = require('express');
var router = express.Router();

var productController = require('../controllers/productController');

router.get('/', function(req, res, next) {
  var products = [];
  products = productController.product_list(req, res);
  res.render('shop', { title: 'Products', products:products });
});

router.get('/product-details/:id',function (req, res, next) {
    var product = productController.product_details(req, res);
    res.render('product-details',{title: 'Products', product:product});
});



router.get('/')
module.exports = router;