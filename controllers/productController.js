var Product = require('../models/product');
var mongoose = require('mongoose');

//Upload Image
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
})

// get list of all Products
exports.product_list = function (req, res, next) {
    var products = [];
    Product.find({}, function (err, result) {
        result.forEach(function (obj) {
            products.push(obj);
        });
        res.render('product/product-list',{title:'List Products',products:products});
    });
};

// Get product details
exports.product_details = function (req, res) {
    var product;
    Product.findById(req.param.id, function (err, result) {
        res.render('product-details',{title: 'Products', product:product});
    })
};

//Get 'Add new' Page
exports.product_AddNew_Get = function (req, res) {
    res.render('product/product-add',{tittle: 'Add new', message: ''});
};

// Post 'Add new' Page
exports.product_AddNew_Post = function (req, res) {
    var newProduct = new Product({
        "imagePath":req.body.imagePath,
        "title": req.body.title,
        "price": req.body.price,
        "brand": req.body.brand,
        "description": req.body.description,
        "tag": req.body.tag
    });
    newProduct.save(function (err) {
        res.render('product/product-add',{tittle: 'Add new', message: err});
    })
};

//Get 'Edit' page
exports.product_Edit_Get = function (req, res) {
    var product;
    Product.findById(req.param.id, function (err, found) {
        product = found;
        res.render('product/product-edit', {tittle: 'Edit', product: product, message: err});
    });
}
exports.product_Edit_Post = function (req, res) {
    var newProduct = new Product({
        "imagePath":req.body.imagePath,
        "title": req.body.title,
        "price": req.body.price,
        "description": req.body.description,
        "tag": req.body.tag
    });

    Product.findByIdAndUpdate(req.param.id, newProduct, function (err) {
        return err;
    })
};

exports.product_Delete = function (req, res) {
    Product.findByIdAndRemove(req.param.id, function (err) {
        res.redirect('/admin');
    })
};

