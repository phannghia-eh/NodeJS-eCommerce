var Admin = require('../models/user');
var Product = require('../models/product');
var User = require('../models/user');

exports.index = function (req, res) {
    //res.render('admin/index', { title: 'Admin Page', username: req.user.username});
    res.render('admin/index', { title: 'Admin Page'});
};

exports.list_product = function (req, res) {
    var products = [];
    Product.find({}, function (err, result) {
        result.forEach(function (obj) {
            products.push(obj);
        });
        res.render('admin/list-products', {title:'List Products',products:products,layout:'admin'});
    });
};
exports.list_user= function(req,res){
   var users = [];
   User.find({}, function (err, result) {
        result.forEach(function (obj) {
            users.push(obj);
        });
        res.render('admin/list-user', {title:'User',users:users,layout:'admin'});
    }); 
}
exports.delete_user= function(req,res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {alert("Not delete");}
        else
        {alert("Delete successful");}
    });
}