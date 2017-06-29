var express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');

router.get('/', adminController.index);

router.get('/index', adminController.index);

router.get('/list-product', adminController.list_product);

module.exports = router;