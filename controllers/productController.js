var Product = require('../models/product');
var mongoose = require('mongoose');
var dbMongo = mongoose.connection;
dbMongo.on('err', console.error.bind(console, 'connect fail'));
dbMongo.once('open',function () {
    console.log('mongo connected');
});

// send/get list of all Products
exports.product_list = function (req, res) {
    var products = [];
    Product.find({}, function (err, result) {
        result.forEach(function (obj) {
            products.push(obj);
        });
        return products;
    });
    return [];
};

exports.product_details = function (req, res) {
    Product.findById(req.param.id, function (err, result) {
        return result;
    })
};

