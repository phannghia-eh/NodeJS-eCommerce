var express = require('express');
var router = express.Router();
var passport = require('passport');

var productController = require('../controllers/productController');

var indexController = require('../controllers/indexController');
router.get('/', productController.product_list_index);

router.get('/search',indexController.searchBy);

module.exports = router;

