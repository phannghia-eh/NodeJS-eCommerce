var Admin = require('../models/user');
var Product = require('../models/product');

exports.index = function (req, res) {
    res.render('admin/index', { title: 'Admin Page', username: req.user.username});
};

exports.list_product = function (req, res) {
    var products = [];
    Product.find({}, function (err, result) {
        result.forEach(function (obj) {
            products.push(obj);
        });
        res.render('admin/list-products', {title:'List Products', products:products, message: err});
    });
};