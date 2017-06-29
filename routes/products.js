var express = require('express');
var router = express.Router();

var productController = require('../controllers/productController');

router.get('/', productController.product_list);

router.get('/product-details/:id',productController.product_details);

router.get('/product-list',productController.product_list);

// ADMIN

//Add new
router.get('/product-add',productController.product_AddNew_Get);

// router.post('/product-add',productController.product_AddNew_Post);
router.post('/product-add', productController.product_AddNew_Post);

//Edit - Update
router.get('/product-edit/:id', productController.product_Edit_Get);

router.post('/product-edit/:id', productController.product_Edit_Post);

//Delete
router.post('/product-delete/:id', productController.product_Delete);

//handle review
router.post('/review', productController.product_review);
module.exports = router;